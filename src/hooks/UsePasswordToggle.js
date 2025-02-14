import React, { useState } from 'react';
// Import FontAwesome components and icons
import { FontAwesomeIcon } from "../utils/fontawesome";

const UsePasswordToggle = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const Icon = (
        <FontAwesomeIcon
            icon={passwordVisible ?  "eye-slash" : "eye"} 
            onClick={() => setPasswordVisible((visibility) => !visibility)}
            style={{ cursor: "pointer" }} 
        />
    );

    const InputType = passwordVisible ? "text" : "password";
    return [InputType, Icon];
};

export default UsePasswordToggle;
