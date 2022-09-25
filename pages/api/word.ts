import type { NextApiRequest, NextApiResponse } from 'next'
import conn from "../../lib/mongo";

import { Word, DIRECTION } from '../../components/word/Definitions';
import { Shuffle } from '../../components/Utility';

const SIZE = 5;

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
  res: NextApiResponse<Word[]>
) {
    try {
        const client = conn;
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


        const words: Word[] = [
            {
                text: Shuffle(wordA, [idx]),
                solution: wordA,
                idx: pos,
                direction: DIRECTION.HORIZONTAL,
                padding: 0
            },
            {
                text: Shuffle(wordB, [pos]),
                solution: wordB,
                idx: idx,
                direction: DIRECTION.VERTICAL,
                padding: 0
            },
        ]

        res.status(200).json(words)
    } catch(e) {
        res.status(500);
    }
}
