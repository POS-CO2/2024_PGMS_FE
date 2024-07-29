import * as footerStyles from "./assets/css/footer.css";
import languageIcon from "./assets/images/language.png";
import React, {useState} from "react";

export default function Footer() {
    const [language, setLanguage] = useState("EN");

    const onClickLanguage = () => {
        setLanguage(prevLanguage => (prevLanguage === "EN" ? "KO" : "EN"));
    };

    return(
        <footer>
            <button className={footerStyles.language_btn} onClick={onClickLanguage}>
                <img src={languageIcon} />
                <p>{language}</p>
            </button>
        </footer>
    );
}
