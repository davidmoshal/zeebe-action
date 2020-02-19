import {ZBClient} from 'zeebe-node'
import {OperationOutcome} from '../main'
import {PublishMessage} from '../operation-config-validation'
import * as t from 'io-ts'
import * as TE from 'fp-ts/lib/TaskEither'

export function publishMessage(
  config: t.TypeOf<typeof PublishMessage>
): OperationOutcome {
  return TE.tryCatch(
    async () => {
      const result: string[] = []
      const zbc = new ZBClient()
      const messagePayload = {
        name: config.messageName,
        variables: config.variables,
        timeToLive: config.timeToLive,
        correlationKey:
          config.correlationKey || ((undefined as unknown) as string)
      }
      await zbc.publishMessage(messagePayload)
      result.push(`Published message to Zeebe.`)
      result.push(JSON.stringify(messagePayload, null, 2))
      const output = JSON.stringify(messagePayload, null, 2)
      await zbc.close()
      return {info: result, output}
    },
    (failure: unknown) => ({message: (failure as Error).message})
  )
}
