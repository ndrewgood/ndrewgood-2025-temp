<script lang="ts">
    import "@mux/mux-player"
    import { onMount, onDestroy } from 'svelte';

	import Icon from '$lib/components/Icon.svelte';
    import { portfolios, socials, projects } from '$lib/data';
    import { fade, fly } from 'svelte/transition';

    // Social links
    
    let showSocials = false;
    let socialTimer: ReturnType<typeof setTimeout> | null = null;
    let socialHover = false;

    function handleLinksMouseLeave() {
        if (showSocials) {
            socialTimer = setTimeout(() => {
                showSocials = false;
            }, 2000);
        }
    }

    function handleLinksMouseEnter() {
        if (socialTimer) {
            clearTimeout(socialTimer);
            socialTimer = null;
        }
    }

    // Projects

    let activeProjectIndex = 0;
    let currentDirection = 1;
    let currentDuration = 0;
    let player: any; // Temporary fix until we have proper types
    let isPlaying = false; // Add this state variable
    let isLoading = false;
    let isTransitioning = false;

    let currentTime = 0;
    let timeUpdateInterval: ReturnType<typeof setInterval>;

    let isHoveringOverVideo = false;
    let mouseIsPressed = false;
    let hoverIcon = 'pause';

    onMount(() => {
        timeUpdateInterval = setInterval(() => {
            currentTime = player?.currentTime || 0;
            if (currentTime > currentDuration - .2 && currentDuration > 10 && !isTransitioning) {
                changeProjectVideo(1);
            }
        }, 100); // Updates 10 times per second for smoother display
    });

    onDestroy(() => {
        if (timeUpdateInterval) {
            clearInterval(timeUpdateInterval);
        }
    });

    function changeProjectVideo(direction: number) {
        currentDirection = direction;
        isTransitioning = true;
        setTimeout(() => {
            activeProjectIndex = (activeProjectIndex + direction + projects.length) % projects.length;
            setTimeout(() => {
                isTransitioning = false;
            }, 200);
        }, 200);

    }

    // Past portfolios

    let showPortfolios = false;
    let portfoliosHovered = false;
    let hoverAmount = 0;
    let activePortfolioIndex = 0;

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;

    function handleMouseMove(event: MouseEvent) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
</script>

<svelte:window on:mousemove={handleMouseMove}/>

<header class="md:mt-18 mt-8 flex justify-between">
    <div class="name">
        <h2>Andrew Goodridge</h2>
        <h4>@ndrewgood</h4>
    </div>
    <div 
        class="relative" 
        on:mouseleave={() => handleLinksMouseLeave()}
        on:mouseenter={() => handleLinksMouseEnter()}
        role="navigation"
    >
        {#if !showSocials}
            
            <div
                in:fly|local={{ duration: 300, y: 10, delay: 100 }}
                out:fly|local={{ duration: 300, y: -10, opacity: 0 }}
            >
            {#if socialHover}
            <p 
                class="absolute right-8 w-max h-6 p-0.5 opacity-50 select-none"
                in:fly={{ duration: 200, x: 5, delay: 0 }}
                out:fly={{ duration: 200, x: 5, opacity: 0 }}
            >
                Show socials
            </p>
            {/if}
            <button 
                on:click={() => showSocials = true}
                on:mouseenter={() => socialHover = true}
                on:mouseleave={() => socialHover = false}
                class="icon-button absolute right-0"
            >
                <Icon name="profile" />
            </button>
        </div>
        {/if}
        {#if showSocials}
        <div class="flex flex-row-reverse gap-1">
            {#each socials as social, index}
                {#if social.platform === 'email'}
                    <button 
                        class="icon-button"
                        on:click={() => {
                            navigator.clipboard.writeText('hey@ndrewgood.com');
                        }}
                        in:fly|global={{ duration: 300, y: 10, delay: 15 * index + 100 }}
                        out:fly|global={{ duration: 300, y: -10, delay: 15 * index }}
                    >
                        <Icon name={social.platform} />
                    </button>
                {:else}
                    <a 
                        href={social.url}
                        target="_blank"
                        class="icon-button"
                        in:fly|global={{ duration: 300, y: 10, delay: 15 * index + 100 }}
                        out:fly|global={{ duration: 300, y: -10, delay: 15 * index }}
                    >
                        <Icon name={social.platform} />
                    </a>
                {/if}
            {/each}
        </div>
        {/if}
    </div>
</header>

<section class="mt-24 flex flex-col gap-4">
    <div
        class="fixed left-0 top-0 z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 drop-shadow-lg"
        style:scale={mouseIsPressed ? 1.4 : 1.5}
        style:opacity={isHoveringOverVideo ? '1' : '0'}
        style:left={mouseX + 'px'}
        style:top={mouseY + 'px'}
        style:transition={'scale 0.1s ease-in-out'}
    >
        <Icon name={hoverIcon} color="--color-white" />
    </div>
    <div class="flex justify-between items-center">
        <div class="flex gap-3 items-center">
            <div 
                class="w-7 h-7 bg-surface-600 rounded-sm flex justify-center items-center"
            >
                <img 
                    src={projects[activeProjectIndex].icon}
                    alt={projects[activeProjectIndex].name} 
                    style:opacity={isTransitioning || isLoading ? '0' : '1'}
                    style:transition={'opacity 0.1s ease-in-out'}
                    class="pointer-events-none select-none"
                />
            </div>
            {#if !isTransitioning && !isLoading}
                <h1
                    in:fly={{ duration: 200, y: currentDirection === 1 ? 5 : -5, delay: 0 }}
                    out:fly={{ duration: 200, y: currentDirection === 1 ? -5 : 5, opacity: 0 }}
                    class="select-none"
                >{projects[activeProjectIndex].name}</h1>
                {#if projects[activeProjectIndex].urlLabel}
                    <a 
                        href={projects[activeProjectIndex].url} 
                        target="_blank" 
                        in:fade|global={{ duration: 100 }}
                        out:fade|global={{ duration: 100 }}
                        class="text-sm font-medium bg-surface-600 hover:bg-surface-700 transition-colors duration-150 px-3 py-1 rounded-full opacity-50"
                    >
                        {projects[activeProjectIndex].urlLabel}
                    </a>
                {/if}
            {/if}
        </div>
            <div class="flex gap-2">
                {#each projects as project, index}
                    <div 
                        class="h-1.5 rounded-full relative" 
                        style:background-color={'var(--color-surface-600)'}
                        style:width={index === activeProjectIndex ? '64px' : '6px'}
                        style:transition={'width 0.3s ease-in-out'}
                        style:transition-timing-function={'cubic-bezier(0.16, 1, 0.3, 1)'}
                    >
                        <div
                            class="h-1.5 rounded-full absolute left-0 top-0"
                            style:background-color={'var(--color-activeSymbol)'}
                            style:opacity={index === activeProjectIndex ? '1' : '0'}
                            style:box-shadow={index === activeProjectIndex ? 'var(--drop-shadow-activeSymbol)' : 'none'}
                            style:width={`${currentTime / currentDuration * 100}%`}
                            style:transition={'opacity 0.1s ease-in-out'}
                        >
                    </div>
                </div>
                {/each}
            </div>
    </div>
    <div class="aspect-[4/3] w-full relative overflow-hidden rounded-xl">
        <div 
            class="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10 cursor-none"
            role="presentation"
            on:mouseenter={() => isHoveringOverVideo = true}
            on:mouseleave={() => isHoveringOverVideo = false}
            on:mousedown={() => mouseIsPressed = true}
            on:mouseup={() => mouseIsPressed = false}
        >
            <div 
                class="w-1/5 h-full opacity-0"
                role="button"
                tabindex="0"
                on:mouseenter={() => hoverIcon = "backwards"}
                on:click={() => changeProjectVideo(-1)}
                on:keydown={(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        changeProjectVideo(-1)
                    }
                }}
            ></div>
            <div class="w-3/5 h-full opacity-0"
                role="button"
                tabindex="0"
                on:mouseenter={() => hoverIcon = "pause"}
                on:click={() => {
                    if (isPlaying) {
                        player.pause();
                        hoverIcon = "play";
                    } else {
                        player.play();
                        hoverIcon = "pause";
                    }
                    isPlaying = !isPlaying;
                }}
                on:keydown={(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        if (!isPlaying) {
                            player.play();
                            isPlaying = true;
                        }
                    }
                }}
            ></div>
            <div 
                class="w-1/5 h-full opacity-0"
                role="button"
                tabindex="0"
                on:mouseenter={() => hoverIcon = "forwards"}
                on:click={() => changeProjectVideo(1)}
                on:keydown={(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        changeProjectVideo(1)
                    }
                }}
            ></div>
        </div>
        <mux-player
            bind:this={player}
            on:loadstart={() => { isLoading = true }}
            on:loadeddata={() => { 
                isLoading = false; 
                currentDuration = player.duration;
                isPlaying = true;
            }}
            class="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
            class:opacity-0={isTransitioning || isLoading}
            style:transform={isTransitioning || isLoading || !isPlaying ? 'scale(0.97)' : 'scale(1.01)'}
            style:transition={'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'}
            style:transition-timing-function={'cubic-bezier(0.16, 1, 0.3, 1)'}
            playback-id={projects[activeProjectIndex].muxID}
            autoplay="true"
            loop="true"
            muted="true"
            preload="auto"
        ></mux-player>
        <div 
            class="absolute left-0 top-0 bg-surface-600 w-full -z-10 aspect-[4/3] rounded-xl"
            style:transform={isTransitioning || isLoading || !isPlaying ? 'scale(0.97)' : 'scale(1)'}
            style:transition={'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'}
            style:transition-timing-function={'cubic-bezier(0.16, 1, 0.3, 1)'}
        ></div>
    </div>
</section>

<section class="mt-24 flex w-full justify-center mb-32">
    {#if !showPortfolios}
        <button 
            on:click={() => {
                showPortfolios = true;
                setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }, 50);
            }}
            class="text-sm font-medium px-8 py-4 rounded-full bg-surface-550 hover:bg-surface-600 text-primary transition-colors duration-150 cursor-pointer"
        >
            View past portfolios
        </button>
    {/if}
    {#if showPortfolios}
        <div 
            class="w-full flex flex-col relative"
            on:mouseenter={() => portfoliosHovered = true}
            on:mouseleave={() => {portfoliosHovered = false; hoverAmount = 0}}
            role="navigation"
        >
            {#if portfoliosHovered}
            <div 
                class="absolute left-0 w-full h-[74.71px] -z-10 rounded-xl bg-surface-550"
                style="top: {activePortfolioIndex * 74.71}px;"
                class:transition-all={hoverAmount > 1}
                style:transition-timing-function={'cubic-bezier(0.16, 1, 0.3, 1)'}
                in:fade={{ duration: 100 }}
                out:fade={{ duration: 100 }}
            ></div>
            {/if}
            {#each portfolios as portfolio, i}
                <a 
                    href={portfolio.url} 
                    class="group w-full flex flex-row justify-between items-center py-4 px-6 rounded-xl transition-colors duration-150 cursor-pointer"
                    on:mouseenter={() => {hoverAmount++; activePortfolioIndex = i}}
                    in:fade|global={{ duration: 400, delay: 15 * i + 150 }}
                >
                    <div class="flex flex-col justify-between">
                        <div class="flex flex-row gap-1.5 transition-all duration-150">
                            <div 
                                class="transition-all duration-150 overflow-hidden"
                                style:width={activePortfolioIndex === i && portfoliosHovered ? '20px' : '0px'}
                            >
                                {#if activePortfolioIndex === i && portfoliosHovered}
                                    <img 
                                        src={portfolio.icon} 
                                        alt={portfolio.label} 
                                        class="w-5 h-5 rounded-sm" 
                                        in:fly={{ x: -10, duration: 150 }}
                                        out:fly={{ x: -10, duration: 150 }}
                                    />
                                {/if}
                            </div>
                            <h2>{portfolio.label}</h2>
                        </div>
                        <p class="opacity-50">{portfolio.range}</p>
                    </div>
                    <Icon name="arrow" className="opacity-50 group-hover:opacity-100 transition-opacity duration-150" />
                </a>
            {/each}
        </div>
    {/if}
</section>

<style lang="postcss">
    @reference "tailwindcss/theme";
    @reference "tailwindcss";
    
    :global(html) {
      font-family: var(--font-aspekta);
      background-color: var(--color-surface);
      color: var(--color-primary);
    }

    :global(body) {
        max-width: 700px;
        width: 90vw;
        margin: 0 auto;
    }

    mux-player {
   /* Hide all controls at once */
   --controls: none;

    /* Hide the error dialog */
    --dialog: none;

    /* Hide the loading indicator */
    --loading-indicator: none;
    }
</style>