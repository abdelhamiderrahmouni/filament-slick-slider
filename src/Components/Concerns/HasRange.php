<?php

namespace AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns;

use Closure;

trait HasRange
{
    protected array | Closure | null $range = null;

    /**
     * Set the value of range
     *
     * @return self
     */
    public function range(array | Closure $range): static
    {
        $this->range = $range;

        return $this;
    }

    /**
     * Get the value of range
     */
    public function getRange(): ?array
    {
        $range = $this->evaluate($this->range);

        if ($range) {
            return $range;
        }

        return [
            'min' => $this->getMin(),
            'max' => $this->getMax(),
        ];
    }
}
