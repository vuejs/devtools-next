export function useCopy() {
  const clipboard = useClipboard()

  return (text: string, type?: string) => {
    clipboard.copy(text)
  }
}
