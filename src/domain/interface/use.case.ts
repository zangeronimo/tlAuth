export interface UseCase<T, Y> {
  executeAsync(data: T): Promise<Y>
}

