```mermaid
stateDiagram-v2
    title 百川平台任务广场和PMP平台之间的数据流 - 状态机
    
    [*] --> 百川广场任务领取
    
    state "百川广场任务领取<br/>硬件试题结构化" as baichuan_task
    state "PMP任务工单管理<br/>状态=待领取" as pmp_task_pending
    state "PMP任务工单管理<br/>已分配用户" as pmp_task_assigned
    state "任务审核<br/>硬件试题结构化审核<br/>一审" as first_review
    state "内审<br/>题库-内审质检-通用内审" as internal_review
    state "审核通过" as approved
    state "审核驳回" as rejected
    state "广场任务中<br/>硬件试题结构化" as baichuan_in_progress
    
    baichuan_task --> pmp_task_pending : 提交任务<br/>可选路径
    baichuan_task --> first_review : 直接提交<br/>默认路径
    
    pmp_task_pending --> pmp_task_assigned : 指派任务<br/>指定用户uid
    pmp_task_assigned --> first_review : 分配完成
    
    first_review --> internal_review : 一审通过
    first_review --> baichuan_in_progress : 一审不通过
    
    internal_review --> approved : 内审通过
    internal_review --> rejected : 内审驳回
    
    baichuan_in_progress --> first_review : 重新提交
    
    approved --> [*]
    rejected --> [*]
```