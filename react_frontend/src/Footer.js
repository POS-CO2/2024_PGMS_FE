import * as footerStyles from "./assets/css/footer.css";
import languageIcon from "./assets/images/language.svg";
import React, {useState} from "react";

export default function Footer() {
    const [language, setLanguage] = useState("English");

    const onClickLanguage = () => {
        setLanguage(prevLanguage => (prevLanguage === "English" ? "Korean" : "English"));
    };

    return(
        <footer>
            <button className={footerStyles.language_btn} onClick={onClickLanguage}>
                <img src={languageIcon} style={{width: "50px"}}/>
                <p>{language}</p>
            </button>
        </footer>
    );
}
