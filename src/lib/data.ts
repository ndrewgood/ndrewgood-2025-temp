interface Social {
    platform: string;
    url?: string;
    icon: string;
}

interface Project {
    name: string;
    url?: string;
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
    {name: 'Mockbox', url: 'https://mockbox.app', icon: 'mockbox', muxID: 'CcyyWriJtLaBxiuqDSOWNL1hlY3IjfSMzx3riBJqKFg'},
    {name: '258 Zine', url: 'https://258-zine.vercel.app', icon: '258zine', muxID: 'NIg02Zef7fuDcGFgAaP4dat00jvg0100jrUA235J7vJTF00E'},
    {name: 'Various sketches', icon: 'sketches', muxID: 'UIL01hQXMCqMgr3GxVUJb35U027bDNvIKCDiP7ymVMCyc'},
    {name: 'SCAD FLUX', icon: 'scadflux', url: 'https://scadflux.com', muxID: 'VzFZjv9JLKPjtssJQOzlUckeep9RgmgPIqkRxQIwA4I'},
    {name: 'CoShuffler', icon: 'coshuffler', url: 'https://www.figma.com/community/plugin/974496433337884240/coshuffler', muxID: 'x7qlhrctWFtNyvBGLMNqsWDY01cjQsgN85T00re004phyw'},
    {name: 'Pixel Bloom', icon: 'pixelbloom', muxID: 'WOAyqsQQ1tO02y8oZIrf7zPCXAuj6AfAdUI54GVuKXiA'},
];

export const portfolios: Portfolio[] = [
    { label: 'My first website', url: 'https://2017.ndrewgood.com', range: 'Nov. 2017 - July 2018', stack: 'Jekyll, Github Pages', icon: 'favicon_2017' },
    { label: 'First React website', url: 'https://2018.ndrewgood.com', range: 'July 2018 - Sept. 2018', stack: 'Gatsby, Github Pages', icon: 'favicon_2018' },
    { label: 'Freshman year portfolio', url: 'https://2019.ndrewgood.com', range: 'Sept. 2018 - Aug. 2019 ', stack: 'Vanilla, Github Pages', icon: 'favicon_2019' },
    { label: 'Sophomore year portfolio', url: 'https://2020.ndrewgood.com', range: 'Aug. 2019 - July 2020', stack: 'Vanilla, Firebase', icon: 'favicon_2020' },
    { label: 'Junior year portfolio', url: 'https://2021.ndrewgood.com', range: 'July 2020 - Dec. 2021', stack: 'Gatsby, Sanity, Netlify', icon: 'favicon_2021' },
    { label: 'Post-grad archive site', url: 'https://2022.ndrewgood.com', range: 'Jan 2022 - Feb. 2025', stack: 'Gatsby, Netlify', icon: 'favicon_2022' },
];