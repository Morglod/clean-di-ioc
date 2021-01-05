import { di } from "./interfaces";
import './objects';

(function main1() {
    const logger = di.singletone('logger');
    
    logger.log('hello');
})();

(function main2() {
    const logger = di.singletone('logger');
    
    logger.log('world');
})();

(function main3() {
    const logger = di.singletone('logger');
    
    logger.flush();
})();