import * as React from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command'

interface ComboboxProps {
  options: string[]
  placeholder: string
  onValueChange: (value: string) => void
}

export function Combobox({ options, placeholder, onValueChange }: ComboboxProps) {
  const [input, setInput] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)

  const filtered = options.filter(option =>
    option.toLowerCase().includes(input.toLowerCase())
  )

  const wrapperRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Command className="rounded-md border bg-background shadow-sm">
        <CommandInput
            placeholder={placeholder}
            value={input}
            onValueChange={(val) => {
                setInput(val)
                setIsOpen(val.length > 0)
                if (val === '') {
                onValueChange('')
                }
            }}
            className="px-3 py-2 text-sm"
        />
      </Command>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
          <Command>
            <CommandEmpty className="px-3 py-2 text-muted-foreground">
              No options found.
            </CommandEmpty>
            <CommandGroup>
              {filtered.map(option => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onValueChange(option)
                    setInput(option)
                    setIsOpen(false)
                  }}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  )
}
