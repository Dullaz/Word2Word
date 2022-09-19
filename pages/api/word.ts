import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../lib/mongo";
import {Document} from 'mongodb'

const SIZE = 5;


export interface IntersectingWords {
    wordA: string,
    wordB: string,
    intersectA: number,
    intersectB: number
}
export interface CharDocument {
    value: string,
    position: number
}
export interface WordDocument {
    value: string,
    characters: Array<CharDocument>
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IntersectingWords>
) {
    try {
        const client = await clientPromise;
        const db = client.db("wordset")
        const collection = db.collection<WordDocument>("words")

        const wordA: string = (await collection
            .aggregate([{$sample: {size:1}}])
            .toArray()).pop()?.value;

        const idx: number = Math.floor(Math.random() * SIZE);
        const pos: number = Math.floor(Math.random() * SIZE);

        const pipeline = [
            { $match: { characters: { value: wordA.charAt(idx), position: pos}}},
            { $sample: { size: 1}}
        ];
        
        const wordB: string = (await collection
            .aggregate(pipeline)
            .tryNext())?.value;

        res.status(200).json({
            wordA,
            wordB,
            intersectA: idx,
            intersectB: pos
        })
    } catch(e) {
        res.status(500);
    }
}
