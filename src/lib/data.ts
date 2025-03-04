const mockboxIcon = '/images/projectIcons/mockbox.png';
const zineIcon = '/images/projectIcons/258zine.png';
const fluxIcon = '/images/projectIcons/flux.png';
const sketchesIcon = '/images/projectIcons/sketches.png';
const coshufflerIcon = '/images/projectIcons/coshuffler.png';
const pixelbloomIcon = '/images/projectIcons/pixelbloom.png';

const portfolio2017Icon = '/images/portfolioFavicons/2017.png';
const portfolio2018Icon = '/images/portfolioFavicons/2018.png';
const portfolio2019Icon = '/images/portfolioFavicons/2019.png';
const portfolio2020Icon = '/images/portfolioFavicons/2020.png';
const portfolio2021Icon = '/images/portfolioFavicons/2021.png';
const portfolio2022Icon = '/images/portfolioFavicons/2022.png';

interface Social {
    platform: string;
    url?: string;
    icon: string;
}

interface Project {
    name: string;
    description: string;
    url?: string;
    urlLabel?: string;
    icon: string;
    muxID: string;
}

interface Portfolio {
    label: string;
    url: string;
    range: string;
    stack: string;
    icon: string;
}

export const socials: Social[] = [
    { platform: 'instagram', url: 'https://instagram.com/ndrewgood', icon: 'instagram' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/ndrewgood', icon: 'linkedin' },
    { platform: 'bluesky', url: 'https://bsky.app/profile/ndrewgood.com', icon: 'bluesky'},
    { platform: 'arena', url: 'https://www.are.na/andrew-goodridge/channels', icon: 'arena'},
    { platform: 'email', icon: 'email'}
];

export const projects: Project[] = [
    {
        name: 'Mockbox',
        description: 'A web tool for mocking up box-shaped objects',
        url: 'https://mockbox.app',
        urlLabel: 'mockbox.app',
        icon: mockboxIcon,
        muxID: 'CcyyWriJtLaBxiuqDSOWNL1hlY3IjfSMzx3riBJqKFg'
    },
    {
        name: '258 Zine',
        description: 'A website for a zine showcasing 6 unique artists',
        url: 'https://258-zine.vercel.app',
        urlLabel: '258-zine.vercel.app',
        icon: zineIcon,
        muxID: 'NIg02Zef7fuDcGFgAaP4dat00jvg0100jrUA235J7vJTF00E'
    },
    {
        name: 'Various sketches',
        description: 'A variety of graphic, motion, and web demos',
        icon: sketchesIcon,
        muxID: 'UIL01hQXMCqMgr3GxVUJb35U027bDNvIKCDiP7ymVMCyc'
    },
    {
        name: 'SCAD FLUX',
        description: 'A website for SCAD\'s UX design club',
        icon: fluxIcon,
        url: 'https://scadflux.com',
        urlLabel: 'scadflux.com',
        muxID: 'VzFZjv9JLKPjtssJQOzlUckeep9RgmgPIqkRxQIwA4I'
    },
    {
        name: 'CoShuffler',
        description: 'A Figma plugin for randomizing colors from a palette',
        icon: coshufflerIcon,
        url: 'https://www.figma.com/community/plugin/974496433337884240/coshuffler',
        urlLabel: 'Figma community page',
        muxID: 'x7qlhrctWFtNyvBGLMNqsWDY01cjQsgN85T00re004phyw'
    },
    {
        name: 'Pixel Bloom',
        description: 'An interactive display which generates flowers',
        icon: pixelbloomIcon,
        muxID: 'WOAyqsQQ1tO02y8oZIrf7zPCXAuj6AfAdUI54GVuKXiA'
    },
];

export const portfolios: Portfolio[] = [
    { label: 'My first website', url: 'https://2017.ndrewgood.com', range: 'Nov. 2017 - July 2018', stack: 'Jekyll, Github Pages', icon: portfolio2017Icon },
    { label: 'First React website', url: 'https://2018.ndrewgood.com', range: 'July 2018 - Sept. 2018', stack: 'Gatsby, Github Pages', icon: portfolio2018Icon },
    { label: 'Freshman year portfolio', url: 'https://2019.ndrewgood.com', range: 'Sept. 2018 - Aug. 2019 ', stack: 'Vanilla, Github Pages', icon: portfolio2019Icon },
    { label: 'Sophomore year portfolio', url: 'https://2020.ndrewgood.com', range: 'Aug. 2019 - July 2020', stack: 'Vanilla, Firebase', icon: portfolio2020Icon },
    { label: 'Junior year portfolio', url: 'https://2021.ndrewgood.com', range: 'July 2020 - Dec. 2021', stack: 'Gatsby, Sanity, Netlify', icon: portfolio2021Icon },
    { label: 'Post-grad archive site', url: 'https://2022.ndrewgood.com', range: 'Jan 2022 - Feb. 2025', stack: 'Gatsby, Netlify', icon: portfolio2022Icon },
];