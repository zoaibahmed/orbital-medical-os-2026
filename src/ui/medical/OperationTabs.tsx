import { useId, type KeyboardEvent, type ReactNode } from 'react'

export function OperationTabs({items,value,onChange,children}:{items:readonly{id:string;label:string}[];value:string;onChange:(value:string)=>void;children:(id:string)=>ReactNode}){
  const prefix=useId()
  function key(event:KeyboardEvent<HTMLButtonElement>,index:number){
    const next=event.key==='ArrowRight'?(index+1)%items.length:event.key==='ArrowLeft'?(index+items.length-1)%items.length:event.key==='Home'?0:event.key==='End'?items.length-1:null
    if(next===null)return
    event.preventDefault();onChange(items[next]!.id)
    const buttons=event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]');buttons?.[next]?.focus()
  }
  return <div className="operation-workspace"><div role="tablist" aria-label="Physical medical operations" className="operation-tabs">{items.map((item,i)=><button key={item.id} type="button" role="tab" id={`${prefix}-${item.id}-tab`} aria-controls={`${prefix}-${item.id}-panel`} aria-selected={value===item.id} tabIndex={value===item.id?0:-1} onKeyDown={event=>key(event,i)} onClick={()=>onChange(item.id)}>{item.label}</button>)}</div>
    {items.map(item=><section key={item.id} role="tabpanel" id={`${prefix}-${item.id}-panel`} aria-labelledby={`${prefix}-${item.id}-tab`} hidden={value!==item.id} tabIndex={0} className="operation-tabpanel">{children(item.id)}</section>)}
  </div>
}
