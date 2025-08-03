import { SystemDto } from '@domain/dto'
import { ActiveEnum } from '@domain/enum/active.enum'
import { ConflictError } from '@domain/errors/conflict.error'
import { NotFoundError } from '@domain/errors/not.found.error'
import { SlugAlreadyExistsError } from '@domain/errors/slug.already.exists.error'
import { type UseCase } from '@domain/interface/use.case'
import { Request, Response, Router } from 'express'
import { container } from 'tsyringe'

export class SystemRouters {
  init = (router: Router) => {
    router.get('/systems', this.getAllAsync)
    router.patch('/systems/:id/:active', this.activeAsync)
    router.get('/systems/:id', this.getByIdAsync)
    router.put('/systems/:id', this.updateAsync)
    router.delete('/systems/:id', this.deleteAsync)
    router.post('/systems', this.createAsync)
  }

  getAllUC = container.resolve<UseCase<'', SystemDto[]>>('SystemGetAllUC')
  getByIdUC =
    container.resolve<UseCase<string, SystemDto | undefined>>('SystemGetByIdUC')
  createUC = container.resolve<
    UseCase<
      {
        name: string
        description: string
        modules?: { name: string; description: string; active: ActiveEnum }[]
      },
      SystemDto
    >
  >('SystemCreateUC')
  updateUC = container.resolve<
    UseCase<
      {
        id: string
        name: string
        description: string
        active: number
        modules?: { name: string; description: string; active: ActiveEnum }[]
      },
      SystemDto
    >
  >('SystemUpdateUC')
  deleteUC = container.resolve<UseCase<string, SystemDto>>('SystemDeleteUC')
  activeUC =
    container.resolve<UseCase<{ id: string; active: number }, SystemDto>>(
      'SystemActiveUC',
    )

  private getAllAsync = async (req: Request, res: Response) => {
    try {
      const result = await this.getAllUC.executeAsync()
      res.status(200).json(result)
    } catch (e: any) {
      res.status(400).json({ message: e.message })
    }
  }

  private getByIdAsync = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.getByIdUC.executeAsync(id)
      res.status(200).json(result)
    } catch (e: any) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message })
      }
      res.status(400).json({ message: e.message })
    }
  }

  private createAsync = async (req: Request, res: Response) => {
    try {
      const { name, description, modules } = req.body
      const result = await this.createUC.executeAsync({
        name,
        description,
        modules,
      })
      res.status(201).json(result)
    } catch (e: any) {
      if (e instanceof SlugAlreadyExistsError) {
        return res.status(409).json({ message: e.message })
      }
      res.status(400).json({ message: e.message })
    }
  }

  private updateAsync = async (req: Request, res: Response) => {
    try {
      const { id: paramId } = req.params
      const { id, name, description, active, modules } = req.body

      if (id !== paramId) throw new ConflictError('Param ID', 'Body ID')

      const result = await this.updateUC.executeAsync({
        id,
        name,
        description,
        active,
        modules,
      })
      res.status(200).json(result)
    } catch (e: any) {
      if (e instanceof ConflictError) {
        return res.status(409).json({ message: e.message })
      }
      if (e instanceof SlugAlreadyExistsError) {
        return res.status(409).json({ message: e.message })
      }
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message })
      }
      res.status(400).json({ message: e.message })
    }
  }

  private deleteAsync = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const result = await this.deleteUC.executeAsync(id)
      res.status(204).json(result)
    } catch (e: any) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message })
      }
      res.status(400).json({ message: e.message })
    }
  }

  private activeAsync = async (req: Request, res: Response) => {
    try {
      const { id, active } = req.params
      const result = await this.activeUC.executeAsync({ id, active: +active })
      res.status(200).json(result)
    } catch (e: any) {
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message })
      }
      res.status(400).json({ message: e.message })
    }
  }
}

