export interface ErrorResData {
  statusCode: number
  message: string | string[]
  error: string | undefined
}

export interface ErrorResDataAction extends Omit<ErrorResData, 'statusCode'> {

}
