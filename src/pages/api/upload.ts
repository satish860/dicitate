import { NextRequest, NextResponse } from 'next/server'



export const config = {
  runtime: 'edge', // this is a pre-requisite
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request: NextRequest): Promise<NextResponse> => {
  const base_url = 'https://api.assemblyai.com/v2'

  const authorization = process.env.ASSEMBLY_AI_KEY

  const headers = new Headers()
  headers.append('Authorization', authorization || '')

  const response = await fetch(`${base_url}/upload`, {
    method: 'POST',
    headers,
    body: await request.blob(),
  })

  const assemblyresponse = await response.json()

  // const upload_url = response.data.upload_url
  return NextResponse.json({
    upload_url : assemblyresponse.upload_url,
  })
}
