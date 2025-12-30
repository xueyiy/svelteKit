import node from '@sveltejs/adapter-node';
import vercel from '@sveltejs/adapter-vercel';
import netlify from '@sveltejs/adapter-netlify';

const isVercel = !!process.env.VERCEL;
const isNetlify = !!process.env.NETLIFY;
const isDocker = !isVercel && !isNetlify;

export default {
  kit: {
    adapter: isVercel
      ? vercel()
      : isNetlify
      ? netlify()
      : node({
          out: 'build',
          precompress: true
        })
  }
};

