const path = 'year';
const type = 'get';

const handler = () => {
    return new Date().getFullYear();
};

export default {type, path, handler};