import { CompanyDto } from '@domain/dto/company.dto'
import { ConflictError } from '@domain/errors/conflict.error'
import { NotFoundError } from '@domain/errors/not.found.error'
import { SlugAlreadyExistsError } from '@domain/errors/slug.already.exists.error'
import { type UseCase } from '@domain/interface/use.case'
import { Request, Response, Router } from 'express'
import { container } from 'tsyringe'

export class CompanyRouters {
  init = (router: Router) => {
    router.get('/companies', this.getAllAsync)
    router.patch('/companies/:id/:active', this.activeAsync)
    router.get('/companies/:id', this.getByIdAsync)
    router.put('/companies/:id', this.updateAsync)
    router.delete('/companies/:id', this.deleteAsync)
    router.post('/companies', this.createAsync)
  }

  getAllUC = container.resolve<UseCase<'', CompanyDto[]>>('CompanyGetAllUC')
  getByIdUC =
    container.resolve<UseCase<string, CompanyDto | undefined>>(
      'CompanyGetByIdUC',
    )
  createUC =
    container.resolve<UseCase<{ name: string; active: number }, CompanyDto>>(
      'CompanyCreateUC',
    )
  updateUC =
    container.resolve<
      UseCase<{ id: string; name: string; active: number }, CompanyDto>
    >('CompanyUpdateUC')
  deleteUC = container.resolve<UseCase<string, CompanyDto>>('CompanyDeleteUC')
  activeUC =
    container.resolve<UseCase<{ id: string; active: number }, CompanyDto>>(
      'CompanyActiveUC',
    )

  private getAllAsync = async (req: Request, res: Response) => {
    try {
      const result = await this.getAllUC.executeAsync('')
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
      const { name, active } = req.body
      const result = await this.createUC.executeAsync({ name, active })
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
      const { id, name, active } = req.body

      if (id !== paramId) throw new ConflictError('Param ID', 'Body ID')

      const result = await this.updateUC.executeAsync({ id, name, active })
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

