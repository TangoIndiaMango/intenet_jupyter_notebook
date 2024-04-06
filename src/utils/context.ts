import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";


export async function getMatches(embeddings: number[]) {
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    })
    // const index = pinecone.Index('intentdb').namespace('intentdb') we cant add our namespace for now
    const index = pinecone.Index('intentdb')


    try {
        const queryResult = await index.query({
            vector: embeddings,
            topK: 5,
            includeMetadata: true,
        })
        // console.log("query result", queryResult)
        return queryResult.matches || []
    } catch (error) {
        console.log(" error querying for the pinecone embeddings",error)
        throw error
    }
    
}

type MetaData = {
    text: string
}

export async function getContext(query: string) {
    const queryEmbeddings = await getEmbeddings(query)
    const matches = await getMatches(queryEmbeddings)

    const qualifyingDocs = matches.filter(match => match.score && match.score > 0.7)

    let docs = qualifyingDocs.map(match => (match.metadata as MetaData).text)

    // if we get 5 vectors based on our query res we join it together
    return docs.join('\n').substring(0, 3000) //we substring so we dont exeed token limit
}

