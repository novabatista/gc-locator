'use client'

import React, {useState} from 'react'
import Button from './Button'

export default function SplitButton({label, options = [], onMainClick, onOptionClick,}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleMainClick = (e) => {
    if (onMainClick) onMainClick(e)
  }

  const handleOptionClick = (option) => {
    setIsOpen(false)
    if (onOptionClick) onOptionClick(option)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Button
          label={label}
          icon="uil uil-angle-down"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && (<div
            className="
              absolute
              right-0
              z-10
              mt-2
              w-56
              origin-top-right
              rounded-md
              shadow-lg
              ring-1
              ring-opacity-5
              text-[var(--color-dark)]
              bg-[var(--color-light)]
              ring-[var(--color-dark)]
            ">
            <div className="py-1">
              {options.map((option, index) => (<button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="
                    block
                    w-full
                    px-4
                    py-2
                    text-left
                    text-sm
                    hover:bg-gray-100
                    cursor-pointer
                  ">
                  {option.label}
                </button>))}
            </div>
          </div>)}
      </div>
    </div>)
}