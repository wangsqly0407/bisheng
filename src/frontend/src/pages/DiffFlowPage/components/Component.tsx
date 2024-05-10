import { DelIcon } from "@/components/bs-icons/del";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/bs-ui/select";
import { useMemo } from "react";
import ComponentParameter from "./ComponentParameter";

export default function Component({ compId, options, disables, version, className, onChangeVersion, onClose }) {

    // 保留当前compId和上游组件
    const nodes = useMemo(() => {
        if (!version) return [];
        const showNodes = {}
        const edges = version.data.edges

        const deep = (_compId) => {
            edges.forEach(edge => {
                if (edge.target === _compId) {
                    showNodes[edge.source] = true
                    showNodes[edge.target] = true
                    deep(edge.source)
                }
            })
        }
        deep(compId)

        return version.data.nodes.filter(node => showNodes[node.id])
    }, [version, compId])

    if (!version) return <div className="bg-[#fff] rounded-md p-2 shadow-sm">
        <div className="group flex justify-center items-center pb-2 border-b">
            <Select onValueChange={onChangeVersion}>
                <SelectTrigger className="w-[120px] h-6">
                    <SelectValue placeholder="选择版本" />
                </SelectTrigger>
                <SelectContent>
                    {
                        options.map(vs => (
                            <SelectItem key={vs.id} value={vs.id} textValue={'vs.name'} disabled={disables.includes(vs.id)}>
                                <div className="flex justify-between w-64">
                                    <span className="w-46 overflow-hidden text-ellipsis whitespace-nowrap">{vs.name}</span>
                                    <span className="text-xs text-muted-foreground">{vs.update_time.replace('T', ' ')}</span>
                                </div>
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
        </div>
        <div className="min-h-[100px]"></div>
    </div>

    return <div className={'bg-[#fff] rounded-md p-2 shadow-sm ' + className}>
        <div className="group flex justify-between items-center pb-2 border-b">
            <Select value={version.id} onValueChange={onChangeVersion}>
                <SelectTrigger className="w-[120px] h-6">
                    <SelectValue placeholder="选择版本" />
                </SelectTrigger>
                <SelectContent>
                        {
                            options.map(vs => (
                                <SelectItem key={vs.id} value={vs.id} textValue={'vs.name'} disabled={disables.includes(vs.id)}>
                                    <div className="flex justify-between w-72">
                                        <span className="w-46 overflow-hidden text-ellipsis whitespace-nowrap">{vs.name}</span>
                                        <span className="text-xs text-muted-foreground">{vs.update_time.replace('T', ' ').substring(0, 16)}</span>
                                    </div>
                                </SelectItem>
                            ))
                        }
                </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground relative pr-8">
                {version.update_time.replace('T', ' ')}
                <DelIcon
                    className="absolute right-0 -top-1 cursor-pointer text-muted-foreground hidden group-hover:block"
                    onClick={onClose}
                />
            </span>
        </div>

        <div className="max-h-52 overflow-y-auto pb-10">
            <div className="flex gap-1 px-2 py-1 text-sm text-muted-foreground">
                <span className="min-w-12 w-28">组件</span>
                <span className="min-w-12 w-28">参数名</span>
                <span className="flex-1">参数值</span>
            </div>
            {
                nodes.map(node => (
                    <div className="flex odd:bg-gray-50 bg-[#f4f5f8] gap-1 mt-1 px-2 py-1 text-sm rounded-sm">
                        <span className="min-w-12 w-28 break-all self-center">{node.data.type}</span>
                        <div className="flex-1 min-w-0">
                            {
                                <ComponentParameter
                                    disabled
                                    flow={version}
                                    node={node}
                                    template={node.data.node.template}
                                >
                                    {
                                        (key, name, formItem) => (
                                            <div key={key} className="flex mb-1">
                                                <span className="min-w-12 w-28 break-all">{name}</span>
                                                <div className="flex-1 min-w-0">{formItem}</div>
                                            </div>
                                        )
                                    }
                                </ComponentParameter>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
};
