import React, { useState } from 'react';
import {  AbsSearch} from 'customer_portal-ui-shared';
import * as Icon from 'react-bootstrap-icons';

interface TreeNode {
  id: string;
  name: string;
  type: 'template' | 'part' | 'section';
  children?: TreeNode[];
  totalLoans?: number;
  totalProjects?: number;
}
 

const ManageDescTemplateList: React.FC = () => { 
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['t1', 'p1']));
 const [val, updateVal] = React.useState<string>("");
    const [searchApplied, updateSearchApplied] = React.useState<string | null>(null);

  const treeData: TreeNode[] = [
    {
      id: 't1',
      name: "Bulk Carrier",
      type: 'template',
    
      children: [
        {
          id: 'p1',
          name: 'Part A',
          type: 'part',
          children: [
            { id: 's1', name: 'Anchoring and Mooring', type: 'section' },
            { id: 's2', name: 'Deck Fitting', type: 'section' },
            { id: 's3', name: 'Deck Piping', type: 'section' },
          ]
        },
        {
          id: 'p2',
          name: 'Part B',
          type: 'part',
          children: [
            { id: 's4', name: 'Cargo Tank', type: 'section' },
            { id: 's5', name: 'Items in All Cargo Tanks', type: 'section' },
            { id: 's6', name: 'Slop Tank', type: 'section' },
          ]
        },
      ]
    },
    {
      id: 't2',
      name: "Bulk Liquid Carrier (other than oil or chemical)",
      type: 'template',
      
      children: [
        {
          id: 'p3',
          name: 'Part A',
          type: 'part',
          children: [
            { id: 's7', name: ' Anchoring and Mooring', type: 'section' },
            { id: 's8', name: 'Deck Fitting', type: 'section' },
            { id: 's9', name: 'Deck Piping', type: 'section' },
          ]
        },
        {
          id: 'p4',
          name: 'Part B',
          type: 'part',
          children: [
            { id: 's10', name: 'Underdeck Foreship Store', type: 'section' },
            { id: 's11', name: 'Cargo Tank', type: 'section' },
            { id: 's12', name: 'Items in All Cargo Tanks', type: 'section' },
          ]
        },
        {
          id: 'p5',
          name: 'Part C',
          type: 'part',
          children: [
            { id: 's13', name: ' Slop Tank', type: 'section' },
            { id: 's14', name: 'Ballast Tank', type: 'section' },
            { id: 's15', name: 'Items in All Ballast Tanks', type: 'section' },
          ]
        },
      ]
    },
    {
      id: 't3',
      name: "Chemical Carrier",
      type: 'template',
      children: [
        {
          id: 'p6',
          name: 'Part A',
          type: 'part',
          children: [
            { id: 's16', name: ' Anchoring and Mooring', type: 'section' },
            { id: 's17', name: 'Deck Fitting', type: 'section' },
            { id: 's18', name: 'Deck Piping', type: 'section' },
          ]
        },
        {
          id: 'p7',
          name: 'Part B',
          type: 'part',
          children: [
            { id: 's19', name: 'Underdeck Foreship Store', type: 'section' },
            { id: 's20', name: 'Cargo Tank', type: 'section' },
            { id: 's21', name: 'Items in All Cargo Tanks', type: 'section' },
          ]
        },
        {
          id: 'p8',
          name: 'Part C',
          type: 'part',
          children: [
            { id: 's22', name: 'Slop Tank', type: 'section' },
            { id: 's23', name: 'Ballast Tank', type: 'section' },
            { id: 's24', name: 'Items in All Ballast Tanks', type: 'section' },
          ]
        },
      ]
    }
  ];

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTree = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = level * 5;

    return (
       <div key={node.id}>
        <div
          className={`tree-node d-flex align-items-start py-1 ${hasChildren ? 'tree-node-clickable' : ''}`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <span className="toggle-icon me-2">
              {isExpanded ? '−' : '+'}
            </span>
          )}
          <div className="d-flex align-items-center">
            {!hasChildren && (
              <Icon.FileText className="me-2" size={16} />
            )}
            <span className={`tree-label ${node.type === 'template' ? 'tree-label-template' : ''} ${node.type === 'section' ? 'tree-label-section' : ''}`}>
              {node.name} {node.type === 'template'}
            </span>
          </div>
        </div>
        {isExpanded && node.children && (
          <div className={level === 0 || level === 1 ? 'tree-children-connector' : ''}>
            {node.children.map(child => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container-fluid p-20 tree-container bg-light"  >
      <div className="bg-white rounded shadow-sm tree-card">
        <div className="p-3 border-bottom bg-white rounded-top d-flex gap-2 align-items-center">
            <div className="position-relative flex-grow-1 me-2">
              <AbsSearch
                      handleClear={() => {
                        updateVal("");
                        updateSearchApplied(null);
                      }}
                      value={val}
                      handleChange={(e:any) => updateVal(e.target.value)}
                      handleSearch={() => {
                        updateSearchApplied(val === "" ? null : val);
                      }}
                      placeholder="Search by Template, Part or Section"
                      searchApplied={searchApplied !== null}
                    />
                  
                       
            </div>
        </div>
        <div className="p-3 tree-scroll-area"   >
          {treeData.map(node => renderTree(node))}
        </div>
      </div>
    </div>
  );
};

export default ManageDescTemplateList;