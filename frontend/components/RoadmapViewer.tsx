'use client';

import { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    Position,
    NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ExternalLink, BookOpen, Video, FileText, X, CheckCircle, Clock, ChevronRight, Trophy, Flame, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Resource {
    title: string;
    url: string;
    type: string;
    platform: string;
    duration?: string;
    free: boolean;
}

interface RoadmapNode {
    id: string;
    label: string;
    description: string;
    estimatedTime?: string;
    resources: Resource[];
}

interface RoadmapEdge {
    source: string;
    target: string;
}

interface Roadmap {
    career_id: string;
    title: string;
    description: string;
    category: string;
    icon?: string;
    nodes: RoadmapNode[];
    edges: RoadmapEdge[];
}

interface RoadmapViewerProps {
    roadmap: Roadmap;
}

// Fire confetti celebration
function celebrate() {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

// Milestone celebration
function celebrateMilestone(percentage: number) {
    if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
        celebrate();
    }
}

// Custom node component for better interactivity
function CustomNode({ data, selected }: { data: any; selected: boolean }) {
    const isCompleted = data.completed;
    const isActive = data.active;
    const isOnPath = data.onPath;
    const isFuturePath = data.futurePath;
    const isDimmed = data.dimmed;

    return (
        <div
            className={`
                px-4 py-3 rounded-xl border-2 transition-all duration-500 min-w-[160px] text-center relative
                ${isDimmed ? 'opacity-30 scale-95' : ''}
                ${isCompleted
                    ? 'bg-gradient-to-br from-green-600/90 to-emerald-700/90 border-green-400 shadow-lg shadow-green-500/30'
                    : isActive
                        ? 'bg-gradient-to-br from-blue-600/90 to-indigo-700/90 border-blue-400 shadow-xl shadow-blue-500/50 scale-110'
                        : isOnPath
                            ? 'bg-gradient-to-br from-green-600/70 to-emerald-700/70 border-green-400/70 shadow-lg shadow-green-500/20'
                            : isFuturePath
                                ? 'bg-gradient-to-br from-blue-500/50 to-indigo-600/50 border-blue-400/50 shadow-lg shadow-blue-500/20 animate-pulse'
                                : selected
                                    ? 'bg-gradient-to-br from-blue-600/90 to-indigo-700/90 border-blue-400 shadow-xl shadow-blue-500/30 scale-105'
                                    : 'bg-gradient-to-br from-slate-700/90 to-slate-800/90 border-slate-500 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105'
                }
            `}
        >
            {/* Completion badge */}
            {isCompleted && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-once">
                    <CheckCircle className="w-4 h-4 text-white" />
                </div>
            )}

            <div className="flex items-center justify-center gap-2">
                <span className="font-medium text-white text-sm">{data.label}</span>
            </div>
            {data.estimatedTime && (
                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-300 opacity-80">
                    <Clock className="w-3 h-3" />
                    <span>{data.estimatedTime}</span>
                </div>
            )}
        </div>
    );
}

const nodeTypes = {
    custom: CustomNode,
};

// Get all ancestors of a node
function getAncestors(nodeId: string, edges: RoadmapEdge[]): Set<string> {
    const ancestors = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
        const current = queue.shift()!;
        const parents = edges.filter(e => e.target === current).map(e => e.source);
        parents.forEach(p => {
            if (!ancestors.has(p)) {
                ancestors.add(p);
                queue.push(p);
            }
        });
    }

    return ancestors;
}

// Get all descendants of a node
function getDescendants(nodeId: string, edges: RoadmapEdge[]): Set<string> {
    const descendants = new Set<string>();
    const queue = [nodeId];

    while (queue.length > 0) {
        const current = queue.shift()!;
        const children = edges.filter(e => e.source === current).map(e => e.target);
        children.forEach(c => {
            if (!descendants.has(c)) {
                descendants.add(c);
                queue.push(c);
            }
        });
    }

    return descendants;
}

// Convert roadmap data to React Flow format
function convertToFlowElements(
    roadmap: Roadmap,
    completedNodes: Set<string>,
    activeNode: string | null
): { nodes: Node[]; edges: Edge[] } {
    const baseX = 400;
    const baseY = 50;
    const ySpacing = 140;
    const xSpacing = 280;

    // Calculate path highlighting
    const ancestors = activeNode ? getAncestors(activeNode, roadmap.edges) : new Set<string>();
    const descendants = activeNode ? getDescendants(activeNode, roadmap.edges) : new Set<string>();
    const onPathNodes = new Set([...ancestors, ...(activeNode ? [activeNode] : [])]);

    // Calculate levels based on dependencies
    const levels: Record<string, number> = {};

    function calculateLevel(nodeId: string): number {
        if (levels[nodeId] !== undefined) return levels[nodeId];

        const incomingEdges = roadmap.edges.filter(e => e.target === nodeId);
        if (incomingEdges.length === 0) {
            levels[nodeId] = 0;
            return 0;
        }

        const parentLevels = incomingEdges.map(e => calculateLevel(e.source));
        levels[nodeId] = Math.max(...parentLevels) + 1;
        return levels[nodeId];
    }

    roadmap.nodes.forEach(n => calculateLevel(n.id));

    // Group nodes by level
    const levelGroups: Record<number, string[]> = {};
    Object.entries(levels).forEach(([nodeId, level]) => {
        if (!levelGroups[level]) levelGroups[level] = [];
        levelGroups[level].push(nodeId);
    });

    // Create positioned nodes
    const nodes: Node[] = roadmap.nodes.map(node => {
        const level = levels[node.id] || 0;
        const nodesAtLevel = levelGroups[level] || [];
        const indexInLevel = nodesAtLevel.indexOf(node.id);
        const totalAtLevel = nodesAtLevel.length;
        const offsetX = (indexInLevel - (totalAtLevel - 1) / 2) * xSpacing;

        const isOnPath = ancestors.has(node.id);
        const isFuturePath = descendants.has(node.id);
        const isDimmed = activeNode !== null && !isOnPath && !isFuturePath && node.id !== activeNode;

        return {
            id: node.id,
            type: 'custom',
            position: { x: baseX + offsetX, y: baseY + level * ySpacing },
            data: {
                ...node,
                completed: completedNodes.has(node.id),
                active: activeNode === node.id,
                onPath: isOnPath && completedNodes.has(node.id),
                futurePath: isFuturePath,
                dimmed: isDimmed,
            },
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
        };
    });

    // Create edges with conditional styling
    const edges: Edge[] = roadmap.edges.map((edge, index) => {
        const isCompleted = completedNodes.has(edge.source) && completedNodes.has(edge.target);
        const isOnPathEdge = (ancestors.has(edge.source) || edge.source === activeNode) &&
            (ancestors.has(edge.target) || edge.target === activeNode);
        const isFutureEdge = (edge.source === activeNode || descendants.has(edge.source)) &&
            descendants.has(edge.target);
        const isActive = activeNode === edge.target || activeNode === edge.source;
        const isDimmed = activeNode !== null && !isOnPathEdge && !isFutureEdge && !isActive;

        const strokeColor = isCompleted || isOnPathEdge ? '#22c55e' : isFutureEdge ? '#3b82f6' : isDimmed ? '#334155' : '#64748b';

        return {
            id: `e${index}`,
            source: edge.source,
            target: edge.target,
            type: 'smoothstep',
            animated: isFutureEdge || isActive,
            style: {
                stroke: strokeColor,
                strokeWidth: isActive ? 4 : isOnPathEdge || isFutureEdge ? 3 : 2,
                opacity: isDimmed ? 0.3 : 1,
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: strokeColor,
                width: 20,
                height: 20,
            },
        };
    });

    return { nodes, edges };
}

const resourceIcons: Record<string, any> = {
    video: Video,
    course: BookOpen,
    article: FileText,
    docs: FileText,
};

// Mobile List View Component
function MobileListView({
    roadmap,
    completedNodes,
    onNodeClick,
    onToggleComplete,
    selectedNode
}: {
    roadmap: Roadmap;
    completedNodes: Set<string>;
    onNodeClick: (node: RoadmapNode) => void;
    onToggleComplete: (nodeId: string) => void;
    selectedNode: RoadmapNode | null;
}) {
    const [expandedNode, setExpandedNode] = useState<string | null>(null);
    const progress = Math.round((completedNodes.size / roadmap.nodes.length) * 100);

    // Sort nodes by dependency level
    const sortedNodes = useMemo(() => {
        const levels: Record<string, number> = {};

        function calculateLevel(nodeId: string): number {
            if (levels[nodeId] !== undefined) return levels[nodeId];
            const incomingEdges = roadmap.edges.filter(e => e.target === nodeId);
            if (incomingEdges.length === 0) {
                levels[nodeId] = 0;
                return 0;
            }
            const parentLevels = incomingEdges.map(e => calculateLevel(e.source));
            levels[nodeId] = Math.max(...parentLevels) + 1;
            return levels[nodeId];
        }

        roadmap.nodes.forEach(n => calculateLevel(n.id));
        return [...roadmap.nodes].sort((a, b) => (levels[a.id] || 0) - (levels[b.id] || 0));
    }, [roadmap]);

    return (
        <div className="w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-700/50">
            {/* Progress Header */}
            <div className="p-4 bg-gray-800/50 border-b border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Your Progress</span>
                    <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-bold text-orange-400">{progress}%</span>
                    </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Node List */}
            <div className="divide-y divide-gray-700/50">
                {sortedNodes.map((node, index) => {
                    const isCompleted = completedNodes.has(node.id);
                    const isExpanded = expandedNode === node.id;

                    return (
                        <div key={node.id} className="relative">
                            {/* Node Header */}
                            <button
                                onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                                className={`w-full p-4 flex items-start gap-4 text-left transition-colors ${isCompleted ? 'bg-green-500/5' : 'hover:bg-gray-800/50'
                                    }`}
                            >
                                {/* Step Number / Completion */}
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold
                                    ${isCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-700 text-gray-400'
                                    }
                                `}>
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                                        {node.label}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{node.description}</p>
                                    {node.estimatedTime && (
                                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            <span>{node.estimatedTime}</span>
                                        </div>
                                    )}
                                </div>

                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="px-4 pb-4 space-y-3 bg-gray-800/30">
                                    {/* Complete Button */}
                                    <button
                                        onClick={() => onToggleComplete(node.id)}
                                        className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${isCompleted
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            }`}
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {isCompleted ? 'Completed!' : 'Mark as Complete'}
                                    </button>

                                    {/* Resources */}
                                    {node.resources.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-semibold text-gray-400 uppercase">Resources</h4>
                                            {node.resources.map((resource, idx) => {
                                                const Icon = resourceIcons[resource.type] || FileText;
                                                return (
                                                    <a
                                                        key={idx}
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                                                    >
                                                        <Icon className="w-4 h-4 text-blue-400" />
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-sm text-white truncate block">{resource.title}</span>
                                                            <span className="text-xs text-gray-500">{resource.platform}</span>
                                                        </div>
                                                        {resource.free && (
                                                            <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">FREE</span>
                                                        )}
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function RoadmapViewer({ roadmap }: RoadmapViewerProps) {
    const [isMobile, setIsMobile] = useState(false);

    // Check for mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Track completed nodes (persisted to localStorage)
    const storageKey = `roadmap-progress-${roadmap.career_id}`;
    const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
    const [lastMilestone, setLastMilestone] = useState(0);

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setCompletedNodes(new Set(JSON.parse(saved)));
        }
    }, [storageKey]);

    // Save progress and check milestones
    const toggleNodeCompletion = useCallback((nodeId: string) => {
        setCompletedNodes(prev => {
            const next = new Set(prev);
            const wasCompleted = next.has(nodeId);

            if (wasCompleted) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
                // Celebrate completion!
                celebrate();
            }

            localStorage.setItem(storageKey, JSON.stringify([...next]));

            // Check for milestone
            const newProgress = Math.round((next.size / roadmap.nodes.length) * 100);
            const milestones = [25, 50, 75, 100];
            milestones.forEach(m => {
                if (newProgress >= m && lastMilestone < m) {
                    setTimeout(() => celebrateMilestone(m), 500);
                    setLastMilestone(m);
                }
            });

            return next;
        });
    }, [storageKey, roadmap.nodes.length, lastMilestone]);

    const { nodes: flowNodes, edges: flowEdges } = useMemo(
        () => convertToFlowElements(roadmap, completedNodes, activeNode),
        [roadmap, completedNodes, activeNode]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

    // Update nodes/edges when completion state changes
    useEffect(() => {
        setNodes(flowNodes);
        setEdges(flowEdges);
    }, [flowNodes, flowEdges, setNodes, setEdges]);

    const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
        const nodeData = roadmap.nodes.find(n => n.id === node.id);
        if (nodeData) {
            setSelectedNode(nodeData);
            setActiveNode(node.id);
        }
    }, [roadmap.nodes]);

    const onPaneClick = useCallback(() => {
        setActiveNode(null);
    }, []);

    // Calculate progress
    const progress = Math.round((completedNodes.size / roadmap.nodes.length) * 100);

    // Mobile view
    if (isMobile) {
        return (
            <MobileListView
                roadmap={roadmap}
                completedNodes={completedNodes}
                onNodeClick={setSelectedNode}
                onToggleComplete={toggleNodeCompletion}
                selectedNode={selectedNode}
            />
        );
    }

    // Desktop view
    return (
        <div className="relative w-full h-[750px] bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gray-900/90 backdrop-blur border-b border-gray-700/50 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-300">Your Progress</span>
                        {progress >= 25 && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 rounded-full">
                                <Flame className="w-3 h-3 text-orange-400" />
                                <span className="text-xs text-orange-400">On Fire!</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {progress === 100 && <Trophy className="w-4 h-4 text-yellow-400" />}
                        <span className="text-sm font-bold text-blue-400">{progress}% Complete</span>
                    </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{completedNodes.size} of {roadmap.nodes.length} topics completed</span>
                    <button
                        onClick={() => {
                            setCompletedNodes(new Set());
                            localStorage.removeItem(storageKey);
                            setLastMilestone(0);
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                        Reset Progress
                    </button>
                </div>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3, minZoom: 0.5, maxZoom: 1.2 }}
                minZoom={0.3}
                maxZoom={2}
                className="pt-20"
                proOptions={{ hideAttribution: true }}
            >
                <Controls
                    className="bg-gray-800/90 border border-gray-700 rounded-lg shadow-lg"
                    showInteractive={false}
                />
                <Background color="#374151" gap={24} size={1} />
                <MiniMap
                    nodeColor={(node) => {
                        if (completedNodes.has(node.id)) return '#22c55e';
                        if (activeNode === node.id) return '#3b82f6';
                        return '#475569';
                    }}
                    maskColor="rgba(0, 0, 0, 0.8)"
                    className="bg-gray-800/90 border border-gray-700 rounded-lg"
                />
            </ReactFlow>

            {/* Resource Panel */}
            {selectedNode && (
                <div className="absolute right-4 top-24 w-96 max-h-[calc(100%-120px)] bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
                    <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/10 to-transparent">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg">{selectedNode.label}</h3>
                                {selectedNode.estimatedTime && (
                                    <div className="flex items-center gap-1 mt-1 text-sm text-blue-400">
                                        <Clock className="w-4 h-4" />
                                        <span>{selectedNode.estimatedTime}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedNode(null);
                                    setActiveNode(null);
                                }}
                                className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-4 overflow-y-auto max-h-[400px]">
                        <p className="text-gray-300 text-sm leading-relaxed">{selectedNode.description}</p>

                        {/* Mark as Complete Button */}
                        <button
                            onClick={() => toggleNodeCompletion(selectedNode.id)}
                            className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${completedNodes.has(selectedNode.id)
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]'
                                }`}
                        >
                            <CheckCircle className="w-5 h-5" />
                            {completedNodes.has(selectedNode.id) ? '✓ Completed!' : 'Mark as Complete'}
                        </button>

                        {selectedNode.resources.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Learning Resources
                                </h4>
                                <div className="space-y-2">
                                    {selectedNode.resources.map((resource, idx) => {
                                        const Icon = resourceIcons[resource.type] || FileText;
                                        return (
                                            <a
                                                key={idx}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-start gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-200 group border border-transparent hover:border-gray-600"
                                            >
                                                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                                    <Icon className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition-colors">
                                                            {resource.title}
                                                        </span>
                                                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                        <span>{resource.platform}</span>
                                                        {resource.duration && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{resource.duration}</span>
                                                            </>
                                                        )}
                                                        {resource.free && (
                                                            <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] font-medium">
                                                                FREE
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Instructions */}
            {!selectedNode && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-gray-400 bg-gray-800/90 backdrop-blur px-5 py-2.5 rounded-full border border-gray-700/50 shadow-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    Click any node to view resources and track progress
                </div>
            )}

            {/* CSS for animations */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                @keyframes bounce-once {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                .animate-bounce-once {
                    animation: bounce-once 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}
