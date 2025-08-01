;; Project Escrow Contract
;; Enables milestone-based fund release for Protofy startup projects

(define-constant ERR-NOT-ADMIN u100)
(define-constant ERR-NOT-FOUND u101)
(define-constant ERR-NOT-AUTHORIZED u102)
(define-constant ERR-NO-FUNDS u103)
(define-constant ERR-MILESTONE-COMPLETED u104)
(define-constant ERR-MILESTONE-NOT-READY u105)
(define-constant ERR-INVALID-PROJECT u106)

(define-data-var contract-admin principal tx-sender)

;; Projects registered into the escrow system
(define-map projects
  uint
  {
    founder: principal,
    dao: principal,
    oracle: principal,
    token-contract: principal,
    milestones: (list 20 bool),
    next-milestone: uint,
    total-funding: uint,
    released-funding: uint
  }
)

(define-private (is-admin)
  (is-eq tx-sender (var-get contract-admin))
)

(define-read-only (get-project (id uint))
  (map-get? projects id)
)

(define-public (register-project
  (id uint)
  (founder principal)
  (dao principal)
  (oracle principal)
  (token-contract principal)
  (milestone-count uint)
  (funding uint)
)
  (begin
    (asserts! (is-admin) (err ERR-NOT-ADMIN))
    (asserts! (<= milestone-count u20) (err u107))
    (map-set projects id {
      founder: founder,
      dao: dao,
      oracle: oracle,
      token-contract: token-contract,
      milestones: (repeat milestone-count false),
      next-milestone: u0,
      total-funding: funding,
      released-funding: u0
    })
    (ok true)
  )
)

(define-public (mark-milestone-complete (id uint))
  (let
    (
      (project (unwrap-panic (map-get? projects id)))
    )
    (begin
      (asserts! (is-eq tx-sender (get oracle project)) (err ERR-NOT-AUTHORIZED))
      (let
        (
          (milestones (get milestones project))
          (idx (get next-milestone project))
        )
        (begin
          (asserts! (< idx (len milestones)) (err ERR-MILESTONE-NOT-READY))
          (map-set projects id {
            founder: (get founder project),
            dao: (get dao project),
            oracle: (get oracle project),
            token-contract: (get token-contract project),
            milestones: (set-at idx true milestones),
            next-milestone: (+ idx u1),
            total-funding: (get total-funding project),
            released-funding: (get released-funding project)
          })
          (ok idx)
        )
      )
    )
  )
)

(define-public (release-funding (id uint) (amount uint))
  (let
    (
      (project (unwrap-panic (map-get? projects id)))
    )
    (begin
      (asserts! (is-eq tx-sender (get dao project)) (err ERR-NOT-AUTHORIZED))
      (asserts! (<= (+ (get released-funding project) amount) (get total-funding project)) (err ERR-NO-FUNDS))
      (map-set projects id {
        founder: (get founder project),
        dao: (get dao project),
        oracle: (get oracle project),
        token-contract: (get token-contract project),
        milestones: (get milestones project),
        next-milestone: (get next-milestone project),
        total-funding: (get total-funding project),
        released-funding: (+ (get released-funding project) amount)
      })
      ;; Token transfer would happen via DAO control in actual deployment
      (ok amount)
    )
  )
)

(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set contract-admin new-admin)
    (ok true)
  )
)

(define-read-only (is-project-complete (id uint))
  (let
    (
      (project (unwrap-panic (map-get? projects id)))
    )
    (is-eq (len (filter identity (get milestones project))) (len (get milestones project)))
  )
)
