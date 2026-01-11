// Shared formatting utilities

export const formatters = {
  date: {
    short: (date: unknown): string => {
      if (!date) return ''
      const d = new Date(date as string)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    },
    
    long: (date: unknown): string => {
      if (!date) return ''
      const d = new Date(date as string)
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    relative: (date: unknown): string => {
      if (!date) return ''
      const now = new Date()
      const target = new Date(date as string)
      const diffMs = now.getTime() - target.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      return `${Math.floor(diffDays / 30)} months ago`
    },
    
    time: (date: unknown): string => {
      if (!date) return ''
      const d = new Date(date as string)
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },

  number: {
    currency: (amount: number, currency = 'USD'): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(amount)
    },
    
    percentage: (value: number, decimals = 1): string => {
      return `${value.toFixed(decimals)}%`
    },
    
    compact: (num: number): string => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
      return num.toString()
    }
  },

  text: {
    truncate: (text: string, maxLength: number): string => {
      if (text.length <= maxLength) return text
      return text.slice(0, maxLength - 3) + '...'
    },
    
    capitalize: (text: string): string => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    },
    
    slugify: (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  }
}

export type Formatters = typeof formatters
