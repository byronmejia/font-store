import axios from 'axios';
import { minifyCss, extractUrls } from './utils';
import { USER_AGENT } from './constants';

axios.defaults.headers.common['User-Agent'] = USER_AGENT;

function encodeUrlContentFunctionFactory(url: string): () => Promise<string> {
    return async (): Promise<string> => {
        const response = await axios.get(url);
        return response.data.toString('base64');
    };
}

async function retrieve(url: string) {
    const response = await axios({
        method: 'get',
        url: url,
    });

    const css: string         = minifyCss(response.data);
    const urls: Array<string> = extractUrls(css);

    console.log(response.data);
    console.log(css);

    if (urls.length === 0) {
        throw new Error('Invalid URL');
    }

    const runnables: Array<() => Promise<string>> = urls.map(encodeUrlContentFunctionFactory);

    // console.log(runnables);

}

retrieve('http://fonts.googleapis.com/css?family=Dosis');
