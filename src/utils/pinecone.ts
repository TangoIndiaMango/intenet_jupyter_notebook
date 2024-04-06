import { Pinecone, PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone"
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

let pinecone: Pinecone | null = null
export const getPineconeClient = async () => {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }
    return pinecone
};

export async function loadDataIntoPinecone(data: string) {
    console.log("Loading data into pinecone");
    if (!data) {
        throw new Error("No data provided!");
    }
    //split and segment data
    const documnet = await prepareDocument(data)
    // console.log(documnet)

    // vectorize and embed documents
    const vectors = await Promise.all(documnet.flat().map(embedDocument))
    // console.log("THESE ARE THE VECTORS TO BE INSTALLED IN DB", vectors)

    // put to pinecone db
    const client = await getPineconeClient()
    const pineconeIndex = client.Index('intentdb')
    // const intentName = 'name'

    console.log('Inserting vectors into pinecone')
    // const namespace = convertTOAscii(intentName)
    pineconeIndex.upsert(vectors as any)

    return documnet[0]
}

export function convertTOAscii(inputString: string) {
    const regex = /[^\x00-\x7F]/g;
    return inputString.replace(regex, "");
}

async function embedDocument(doc: Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent)
        // console.log("THIS EMBEDDINGS IN PINECONE", embeddings)
        const hash = md5(doc.pageContent)

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text
            }
        } as unknown as RecordMetadata

    } catch (error) {
        console.log('error embedding documnet', error)
        throw error
    }
}

export const trucateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}

async function prepareDocument(text: any) {
    // remove all the new lines in the text and replace with spaces
    const textWithoutNewLines = text.replace(/\n/g, " ");
    
    // split the text into sentences
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })

    const docs = await splitter.splitDocuments([
        new Document({ 
            pageContent: textWithoutNewLines,
            metadata: {
                source: "text",
                text: trucateStringByBytes(textWithoutNewLines, 36000),
            }
         })
    ])

    return docs
}