import { describe, it, expect, beforeEach } from "vitest"

const admin = "STADMIN111111111111111111111111111111111"
const founder = "STFOUNDER11111111111111111111111111111"
const dao = "STDAO1111111111111111111111111111111111"
const oracle = "STORACLE111111111111111111111111111111"
const token = "STTOKEN1111111111111111111111111111111"

let projectEscrow: any

beforeEach(() => {
  projectEscrow = {
    admin,
    projects: new Map<number, any>(),

    registerProject(
      caller: string,
      id: number,
      founder: string,
      dao: string,
      oracle: string,
      tokenContract: string,
      milestoneCount: number,
      funding: number
    ) {
      if (caller !== this.admin) return { error: 100 }
      if (milestoneCount > 20) return { error: 107 }

      this.projects.set(id, {
        founder,
        dao,
        oracle,
        tokenContract,
        milestones: Array(milestoneCount).fill(false),
        nextMilestone: 0,
        totalFunding: funding,
        releasedFunding: 0
      })
      return { value: true }
    },

    markMilestoneComplete(caller: string, id: number) {
      const p = this.projects.get(id)
      if (!p) return { error: 101 }
      if (caller !== p.oracle) return { error: 102 }
      if (p.nextMilestone >= p.milestones.length) return { error: 105 }

      p.milestones[p.nextMilestone] = true
      p.nextMilestone++
      return { value: p.nextMilestone - 1 }
    },

    releaseFunding(caller: string, id: number, amount: number) {
      const p = this.projects.get(id)
      if (!p) return { error: 101 }
      if (caller !== p.dao) return { error: 102 }
      if (p.releasedFunding + amount > p.totalFunding) return { error: 103 }

      p.releasedFunding += amount
      return { value: amount }
    },

    isProjectComplete(id: number) {
      const p = this.projects.get(id)
      if (!p) return false
      return p.milestones.every(Boolean)
    }
  }
})

describe("Project Escrow Contract", () => {
  it("should register a project by admin", () => {
    const result = projectEscrow.registerProject(admin, 1, founder, dao, oracle, token, 3, 1000)
    expect(result).toEqual({ value: true })
  })

  it("should reject registration from non-admin", () => {
    const result = projectEscrow.registerProject(founder, 1, founder, dao, oracle, token, 3, 1000)
    expect(result).toEqual({ error: 100 })
  })

  it("should complete a milestone by oracle", () => {
    projectEscrow.registerProject(admin, 1, founder, dao, oracle, token, 3, 1000)
    const result = projectEscrow.markMilestoneComplete(oracle, 1)
    expect(result).toEqual({ value: 0 })
  })

  it("should reject milestone completion by unauthorized", () => {
    projectEscrow.registerProject(admin, 1, founder, dao, oracle, token, 3, 1000)
    const result = projectEscrow.markMilestoneComplete(dao, 1)
    expect(result).toEqual({ error: 102 })
  })

  it("should release funding by DAO", () => {
    projectEscrow.registerProject(admin, 1, founder, dao, oracle, token, 3, 1000)
    const result = projectEscrow.releaseFunding(dao, 1, 300)
    expect(result).toEqual({ value: 300 })
  })

  it("should not allow over-release of funds", () => {
    projectEscrow.registerProject(admin, 1, founder, dao, oracle, token, 3, 1000)
    projectEscrow.releaseFunding(dao, 1, 700)
    const result = projectEscrow.releaseFunding(dao, 1, 400)
    expect(result).toEqual({ error: 103 })
  })

  it("should return true for complete project", () => {
    projectEscrow.registerProject(admin, 1, founder, dao, oracle, token, 2, 500)
    projectEscrow.markMilestoneComplete(oracle, 1)
    projectEscrow.markMilestoneComplete(oracle, 1)
    expect(projectEscrow.isProjectComplete(1)).toBe(true)
  })
})
