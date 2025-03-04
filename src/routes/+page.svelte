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
    let hoverIcon = 'pause';

    onMount(() => {
        timeUpdateInterval = setInterval(() => {
            currentTime = player?.currentTime || 0;
            if (currentTime > currentDuration - .2 && currentDuration > 10 && !isTransitioning) {
                changeProjectVideo(1);
            }
        }, 100); // Updates 10 times per second for smoother display

        helpOverlayTimer = setTimeout(() => {
            showHelpOverlay = true;
            helpOverlayTimer = setTimeout(() => {
                showHelpOverlay = false;
            }, 3000);
        }, 2000);
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

    // Projects - Mobile swipe

    const SWIPE_SCALE_MIN = 2;
    const SWIPE_SCALE_MAX = 3;
    const SWIPE_SCALE_DIST = 100;

    let mouseX = 0;
    let mouseY = 0;

    let isSwiping = false;
    let swipeDirection = 1;
    let clickDetection = false
    let afterFirstSwipe = false;

    let swipeStartX = 0;
    let swipeDeltaX = 0;
    let swipeScale = 1;
    let swipeOpacity = 0;

    function handleSwipeEnd() {
        if (swipeOpacity == 1) {
            if (!afterFirstSwipe) {
                afterFirstSwipe = true;
            }
            changeProjectVideo(swipeDirection);
        } else if (Math.abs(swipeDeltaX) < 5) {  // Handle as a tap
            if (isPlaying) {
                player.pause();
                hoverIcon = "play";
            } else {
                player.play();
                hoverIcon = "pause";
            }
            isPlaying = !isPlaying;
        }
        isSwiping = false;
        swipeStartX = 0;
        swipeDeltaX = 0;
        swipeScale = 1;
        swipeOpacity = 0;
    }

    function handleMouseMove(e: MouseEvent) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (isSwiping) {
            swipeDeltaX = mouseX - swipeStartX;
            swipeDirection = swipeDeltaX > 0 ? -1 : 1;

            swipeOpacity = Math.abs(swipeDeltaX) / SWIPE_SCALE_DIST;
            swipeOpacity = Math.max(0, Math.min(1, swipeOpacity));
            
            swipeScale = SWIPE_SCALE_MIN + (Math.abs(swipeDeltaX) / SWIPE_SCALE_DIST) * (SWIPE_SCALE_MAX - SWIPE_SCALE_MIN);
            swipeScale = Math.max(SWIPE_SCALE_MIN, Math.min(SWIPE_SCALE_MAX, swipeScale));
        }
    }

    function handleTouchMove(e: TouchEvent) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;

        if (isSwiping) {
            e.preventDefault();
            swipeDeltaX = mouseX - swipeStartX;
            swipeDirection = swipeDeltaX > 0 ? -1 : 1;

            swipeOpacity = Math.abs(swipeDeltaX) / SWIPE_SCALE_DIST;
            swipeOpacity = Math.max(0, Math.min(1, swipeOpacity));
            
            swipeScale = SWIPE_SCALE_MIN + (Math.abs(swipeDeltaX) / SWIPE_SCALE_DIST) * (SWIPE_SCALE_MAX - SWIPE_SCALE_MIN);
            swipeScale = Math.max(SWIPE_SCALE_MIN, Math.min(SWIPE_SCALE_MAX, swipeScale));
        }
    }

    // Projects - Help overlay

    let showHelpOverlay = false;
    let helpOverlayTimer: ReturnType<typeof setTimeout> | null = null;

    function handleSwipeStart() {
        if (helpOverlayTimer) {
            clearTimeout(helpOverlayTimer);
            helpOverlayTimer = null;
        }
        showHelpOverlay = false;
        isSwiping = true;
        swipeStartX = mouseX;
    }

    // Past portfolios

    let showPortfolios = false;
    let portfoliosHovered = false;
    let hoverAmount = 0;
    let activePortfolioIndex = 0;

</script>

<svelte:window 
    on:mousemove={handleMouseMove}
    on:touchmove={handleTouchMove}
/>

<header class="md:mt-12 mt-8 flex justify-between">
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

<section class="mt-16 flex flex-col gap-4">
    <div class="flex justify-between items-center min-h-16 xs:min-h-11">
        <div class="flex gap-3 items-start">
            <div 
                class="w-9 h-9 min-w-9 min-h-9 rounded-sm flex justify-center items-center"
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
                <div 
                    class="flex flex-col gap-0 select-none"
                    in:fly={{ duration: 200, y: currentDirection === 1 ? 5 : -5, delay: 0 }}
                    out:fly={{ duration: 200, y: currentDirection === 1 ? -5 : 5, opacity: 0 }}
                >
                    <h2>{projects[activeProjectIndex].name}</h2>
                    <p class="text-sm opacity-50 -mt-[1px]">{projects[activeProjectIndex].description}</p>
                </div>
            {/if}
        </div>
        {#if projects[activeProjectIndex].urlLabel && !isTransitioning && !isLoading}
            <a 
                href={projects[activeProjectIndex].url} 
                target="_blank" 
                in:fade|global={{ duration: 100 }}
                out:fade|global={{ duration: 100 }}
                class="text-sm md:flex hidden gap-1 items-center font-medium bg-surface-600 hover:bg-surface-700 transition-colors duration-150 pr-4 pl-1 py-1 rounded-full opacity-50"
            >
                <Icon name="globe" />
                {projects[activeProjectIndex].urlLabel}
            </a>
        {/if}
        <!-- {#if !isTransitioning && !isLoading}
            <p class="text-sm opacity-50 md:hidden min-w-64 text-right">
                {projects[activeProjectIndex].description}
            </p>
        {/if} -->
    </div>
    <div class="aspect-[4/3] w-full relative">

        <!-- Mobile video controls -->
        <div 
            class="w-full h-full md:hidden absolute top-0 left-0 z-20 cursor-pointer"
            role="presentation"
            on:mouseleave={() => isSwiping ? handleSwipeEnd() : null}
            on:mouseup={() => isSwiping ? handleSwipeEnd() : null}
            on:touchend={() => isSwiping ? handleSwipeEnd() : null}
            on:touchcancel={() => isSwiping ? handleSwipeEnd() : null}
        >
            <button 
                class="w-full h-full cursor-grab active:cursor-grabbing"
                aria-label="Swipe navigation control"
                on:mousedown={(e) => {
                    handleSwipeStart();
                }}
                on:touchstart|preventDefault={(e) => {
                    handleSwipeStart();
                    swipeStartX = e.touches[0].clientX;
                }}
                type="button"
            >
                <div 
                    class="flex justify-center items-center"
                    style:transform={isSwiping ? `scale(${swipeScale})` : 'scale(1)'}
                    style:opacity={swipeOpacity}
                >
                    <Icon name={swipeDirection === 1 ? "forwards" : "backwards"} color="--color-white" />
                </div>
            </button>
        </div>

        <!-- Desktop video controls -->
        <div 
            class="absolute top-0 left-0 w-full h-full md:flex hidden justify-center items-center z-10 cursor-pointer"
            role="presentation"
            on:mouseenter={() => isHoveringOverVideo = true}
            on:mouseleave={() => isHoveringOverVideo = false}
        >
            <div 
                class="w-1/5 h-full flex justify-center items-center relative"
                role="button"
                tabindex="0"
                on:mouseenter={() => hoverIcon = "backwards"}
                on:click={() => changeProjectVideo(-1)}
                on:keydown={(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        changeProjectVideo(-1)
                    }
                }}
            >
                <div 
                    class="drop-shadow-xl"
                    style:opacity={isHoveringOverVideo && hoverIcon === "backwards" ? 1 : isHoveringOverVideo ? '0.7' : '0'}
                    style:transform={isHoveringOverVideo && hoverIcon === "backwards" ? 'scale(1.5)' : 'scale(1.2)'}
                    style:transition={'transform 0.1s ease-in-out, opacity 0.2s ease-in-out'}
                >
                    <Icon name="backwards" color="--color-white" />
                </div>
                <div 
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black/ rounded-full -z-10"
                    style:filter={'blur(20px)'}
                    style:opacity={isHoveringOverVideo ? '0.2' : '0'}
                ></div>
            </div>
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
                class="w-1/5 h-full flex justify-center items-center relative"
                role="button"
                tabindex="0"
                on:mouseenter={() => hoverIcon = "forwards"}
                on:click={() => changeProjectVideo(1)}
                on:keydown={(e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        changeProjectVideo(1)
                    }
                }}
            >
                <div 
                    class="drop-shadow-xl"
                    style:opacity={isHoveringOverVideo && hoverIcon === "forwards" ? 1 : isHoveringOverVideo ? '0.7' : '0'}
                    style:transform={isHoveringOverVideo && hoverIcon === "forwards" ? 'scale(1.5)' : 'scale(1.2)'}
                    style:transition={'transform 0.1s ease-in-out, opacity 0.1s ease-in-out'}
                >
                    <Icon name="forwards" color="--color-white" />
                </div>
            </div>
        </div>
        <div 
            class="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
            class:opacity-0={isTransitioning || isLoading}
            style:transform-style={'preserve-3d'}
            style:transform={isTransitioning || isLoading || !isPlaying ? 'scale(0.97)' : 'scale(1)'}
            style:transition={'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'}
            style:transition-timing-function={'cubic-bezier(0.16, 1, 0.3, 1)'}
        >
            <!-- Mobile help overlay -->
            {#if showHelpOverlay}
            <div 
                class="absolute top-0 left-0 w-full flex justify-center items-end p-4 h-full z-10 transition-colors duration-150 bg-black/40"
                in:fade={{ duration: 200 }}
                out:fade={{ duration: 200 }}
            >
                <p 
                    class="text-sm text-white font-medium"
                    in:fly={{ duration: 200, y: currentDirection === 1 ? 5 : -5, delay: 0 }}
                    out:fly={{ duration: 200, y: currentDirection === 1 ? -5 : 5, opacity: 0 }}
                >
                    Swipe to navigate
                </p>
        </div>
            {/if}
            <div class="absolute top-0 left-0 w-full h-full z-10 transition-colors duration-150"
                style:background-color={isHoveringOverVideo ? 'rgba(0, 0, 0, 0.2)' : isSwiping && (swipeDeltaX > 5 || swipeDeltaX < -5) ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0)'}
            ></div>
            <mux-player
                bind:this={player}
                on:loadstart={() => { isLoading = true }}
                on:loadeddata={() => { 
                    isLoading = false; 
                    currentDuration = player.duration;
                    isPlaying = true;
                }}
                style:transform={'scale(1.01)'}
                class="aspect-[4/3] rounded-xl overflow-hidden"
                playback-id={projects[activeProjectIndex].muxID}
                autoplay="true"
                loop="true"
                muted="true"
                preload="auto"
            ></mux-player>
        </div>

        <!-- <div 
            class="absolute top-1/2 -translate-y-1/2 bg-surface-600 w-full h-[calc(100%-30px)] -z-10 rounded-xl"
            style:left={isHoveringOverVideo && !isTransitioning && !isLoading && hoverIcon === "backwards" ? '-30px' : isHoveringOverVideo && !isTransitioning && !isLoading && hoverIcon === "forwards" ? '30px' : '0px'}
            style:transform={isHoveringOverVideo && !isPlaying && hoverIcon === "backwards" ? 'rotate(-1deg) scale(0.97)'
                : isHoveringOverVideo && !isTransitioning && !isLoading && hoverIcon === "backwards" ? 'rotate(-1deg)'
                    : isHoveringOverVideo && !isPlaying && hoverIcon === "forwards" ? 'rotate(1deg) scale(0.97)' 
                        : isHoveringOverVideo && !isTransitioning && !isLoading && hoverIcon === "forwards" ? 'rotate(1deg)' 
                            : isTransitioning || isLoading || !isPlaying ? 'scale(0.97)' : 'scale(1)'}
            style:transition={'left 0.3s ease-in-out, transform 0.3s ease-in-out'}
            style:transition-timing-function={'cubic-bezier(0.16, 1, 0.3, 1)'}
        ></div> -->

        <div 
            class="absolute left-0 top-0 bg-surface-600 w-full -z-10 aspect-[4/3] rounded-xl"
            style:transform={isTransitioning || isLoading || !isPlaying ? 'scale(0.97)' : 'scale(1)'}
            style:transition={'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'}
            style:transition-timing-function={'cubic-bezier(0.16, 1, 0.3, 1)'}
        ></div>
    </div>
    <div class="mt-2 flex gap-2 w-full justify-center">
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
                    target="_blank"
                    class="group w-full flex flex-row justify-between items-center py-4 px-6 rounded-xl transition-colors duration-150 cursor-pointer"
                    on:mouseenter={() => {hoverAmount++; activePortfolioIndex = i}}
                    in:fade|global={{ duration: 400, delay: 15 * i + 150 }}
                >
                    <div class="flex flex-col justify-between">
                        <div class="flex flex-row transition-all duration-150">
                            <div 
                                class="transition-all duration-150 overflow-hidden"
                                style:width={activePortfolioIndex === i && portfoliosHovered ? '20px' : '0px'}
                                style:margin-right={activePortfolioIndex === i && portfoliosHovered ? '6px' : '0px'}
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