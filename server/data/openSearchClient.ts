import { Client } from '@opensearch-project/opensearch'
import config from '../config'

const client = new Client({
  node: config.opensearch.url,
})

export default client
