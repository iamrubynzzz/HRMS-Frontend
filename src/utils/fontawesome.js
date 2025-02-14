import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faEnvelope, faEye, faEyeSlash,faCaretDown } from "@fortawesome/free-solid-svg-icons";

// Add icons to the library
library.add(faEnvelope,faEye,faEyeSlash,faCaretDown);

// Export FontAwesomeIcon for use in components
export { FontAwesomeIcon };
