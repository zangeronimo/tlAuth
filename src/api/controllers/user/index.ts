import { UserDto } from '@domain/dto/user.dto'
import { ConflictError } from '@domain/errors/conflict.error'
import { EmailAlreadyExistsError } from '@domain/errors/email.already.exists.error'
import { NotFoundError } from '@domain/errors/not.found.error'
import { UseCase } from '@domain/interface/use.case'
import { Request, Response, Router } from 'express'
import { container } from 'tsyringe'

export class UserRouters {
  init = (router: Router) => {
    router.get('/users', this.getAllAsync)
    router.patch('/users/:id/:active', this.activeAsync)
    router.get('/users/:id', this.getByIdAsync)
    router.put('/users/:id', this.updateAsync)
    router.delete('/users/:id', this.deleteAsync)
    router.post('/users', this.createAsync)
  }

  getAllUC = container.resolve<UseCase<undefined, UserDto[]>>('UserGetAllUC')
  getByIdUC =
    container.resolve<UseCase<string, UserDto | undefined>>('UserGetByIdUC')
  createUC =
    container.resolve<
      UseCase<
        { name: string; email: string; active: number; companies: string[] },
        UserDto
      >
    >('UserCreateUC')
  updateUC = container.resolve<
    UseCase<
      {
        id: string
        name: string
        email: string
        active: number
        companies: []
      },
      UserDto
    >
  >('UserUpdateUC')
  deleteUC = container.resolve<UseCase<string, UserDto>>('UserDeleteUC')
  activeUC =
    container.resolve<UseCase<{ id: string; active: number }, UserDto>>(
      'UserActiveUC',
    )

  private createAsync = async (req: Request, res: Response) => {
    try {
      const { name, email, active, companies } = req.body
      const result = await this.createUC.executeAsync({
        name,
        email,
        active,
        companies,
      })
      res.status(201).json(result)
    } catch (e: any) {
      if (e instanceof EmailAlreadyExistsError) {
        return res.status(409).json({ message: e.message })
      }
      if (e instanceof NotFoundError) {
        return res.status(404).json({ message: e.message })
      }
      res.status(400).json({ message: e.message })
    }
  }

  private getAllAsync = async (req: Request, res: Response) => {
    try {
      const result = await this.getAllUC.executeAsync(undefined)
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

  private updateAsync = async (req: Request, res: Response) => {
    try {
      const { id: paramId } = req.params
      const { id, name, email, active, companies } = req.body

      if (id !== paramId) throw new ConflictError('Param ID', 'Body ID')

      const result = await this.updateUC.executeAsync({
        id,
        name,
        email,
        active,
        companies,
      })
      res.status(200).json(result)
    } catch (e: any) {
      if (e instanceof ConflictError) {
        return res.status(409).json({ message: e.message })
      }
      if (e instanceof EmailAlreadyExistsError) {
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

