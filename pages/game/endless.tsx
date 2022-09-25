import { NextPage } from "next";
import { useRouter } from 'next/router'

import { BiArrowBack } from "react-icons/bi"


import styles from '../../styles/Home.module.css';
import { EndlessGrid } from "../../components/word/variants/EndlessGrid";

const Endless: NextPage = () => {
    const router = useRouter();

    return (
        <>
        <div className={styles.container}>
            <BiArrowBack className={styles.control} size="5em" onClick={() => router.back()}/>
            <div className={styles.main}>
                <EndlessGrid />
            </div>
        </div>
        </>
    )
}

export default Endless;