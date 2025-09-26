@php
    $sliderId = $getId();
    $containerId = $sliderId . '-container';
    $startValue = $getState() ? [$getState()] : [0];
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :id="$containerId" :label="$getLabel()"
    :label-sr-only="$isLabelHidden()"
    :helper-text="$getHelperText()"
    :hint="$getHint()"
    :hint-icon="$getHintIcon()"
    :required="$isRequired()"
    :state-path="$getStatePath()"
    style="margin-bottom: 50px"
>
    <div style="display: none">
        {{ $getChildComponentContainer() }}
    </div>

    <div
        class="mb-[200px]"
        ax-load
        ax-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('filament-slick-slider-scripts', 'abdelhamiderrahmouni/filament-slick-slider') }}"
        x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('filament-slick-slider-styles', 'abdelhamiderrahmouni/filament-slick-slider'))]"
        id="{{ $sliderId }}"
        x-data="slider({
            element: '{{ $sliderId }}',
            start: @js($getStart()),
            state: @js($getStates()),
            connect: @js($getConnect()),
            range: @js($getRange()),
            step: @js($getStep()),
            behaviour: @js($getBehaviour()),
            snap:@js($getSnap()),
            tooltips: @js($getTooltips()),
            format: @js($getFormat()),
            onChange(values, handle, unencoded, tap, positions, states) {
                const nums = values.map((v) => {
                    const n = parseFloat(v);
                    return Number.isNaN(n) ? v : n;
                });

                for (let i = 0; i < nums.length && i < states.length; i++) {
                    console.log(states[i], nums[i]);
                    $wire.$dispatch(states[i], nums[i]);
                }
            }
        })"></div>
</x-dynamic-component>
