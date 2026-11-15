import { useEffect, useRef, type RefObject } from 'react'

/** Retain content/focus during a short dismiss motion; cancel cleanly on unmount. */
export function useDialogDismiss(dialog: RefObject<HTMLDialogElement | null>, onDismiss: () => void, reduced: boolean, contextKey: string) {
  const animation=useRef<Animation|null>(null)
  useEffect(()=>()=>{animation.current?.cancel()},[contextKey])
  return () => {
    const element=dialog.current
    if(reduced||!element?.animate){onDismiss();return}
    animation.current?.cancel()
    const pending=element.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(12px)'}],{duration:180,easing:'ease-in',fill:'forwards'})
    animation.current=pending
    void pending.finished.then(()=>{
      if(animation.current!==pending)return
      animation.current=null;pending.cancel();onDismiss()
    }).catch(()=>{/* Dismissal interrupted or component unmounted. */})
  }
}
