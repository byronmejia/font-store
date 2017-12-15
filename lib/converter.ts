import { parse } from 'url';
import { minifyCss } from './utils';
import axios from 'axios';
import { USER_AGENT } from './constants';

async function retrieve(unparsedUrl: string) {
    const response = await axios.get(unparsedUrl, {
        headers: {
            'User-Agent': USER_AGENT
        }
    });

    const css: string = minifyCss(response.data);

    console.log(css);
}

retrieve('http://fonts.googleapis.com/css?family=Dosis ');
