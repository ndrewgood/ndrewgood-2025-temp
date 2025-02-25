<script lang="ts">
    import "@mux/mux-player"

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

    // Past portfolios

    let showPortfolios = false;
    let portfoliosHovered = false;
    let hoverAmount = 0;
    let activePortfolioIndex = 0;

    let player: any; // Temporary fix until we have proper types
    let isPlaying = false; // Add this state variable
</script>

<header class="mt-24 flex justify-between">
    <div class="name">
        <h1>Andrew Goodridge</h1>
        <h3>@ndrewgood</h3>
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
                <a 
                    href={social.url}
                    target="_blank"
                    class="icon-button"
                    in:fly|global={{ duration: 300, y: 10, delay: 15 * index + 100 }}
                    out:fly|global={{ duration: 300, y: -10, delay: 15 * index }}
                >
                    <Icon name={social.platform} />
                </a>
            {/each}
        </div>
        {/if}
    </div>
</header>

<section class="mt-24">
    <div class="top">
        <div class="left">
            <div class="image"></div>
            <h1>Project Title</h1>
        </div>
        <div class="right">
            <div class="progress"></div>
        </div>
    </div>
    <mux-player
        bind:this={player}
        role="button"
        on:click={() => {
            if (isPlaying) {
                player.pause();
            } else {
                player.play();
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
        
        playback-id={projects[0].muxID}
        autoplay="true"
        loop="true"
        muted="true"
        preload="auto"
        tabindex="0"
    ></mux-player>
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
                        <h1>{portfolio.label}</h1>
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