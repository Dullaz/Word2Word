// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { DIRECTION, Word } from '../../components/word/Definitions';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Word[]>
) {
    const words: Word[] = [
        {
            text: "GLOWY",
            solution: "GLOWY",
            idx: 0,
            direction: DIRECTION.HORIZONTAL,
            padding: 0
        },
        {
            text: "TASTE",
            solution: "TASTE",
            idx: 3,
            direction: DIRECTION.HORIZONTAL,
            padding: 0
        },
        {
            text: "GOATS",
            solution: "GOATS",
            idx: 0,
            direction: DIRECTION.VERTICAL,
            padding: 0
        },
        {
            text: "WASTE",
            solution: "WASTE",
            idx: 3,
            direction: DIRECTION.VERTICAL,
            padding: 0
        }
    ];

    res.status(200).json(words);
}
