import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import Modal from "react-modal";
import {toast, ToastContainer} from "react-toastify";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell} from 'recharts';
import {Heatmap, XAxis as XAxisHeatmap, YAxis as YAxisHeatmap, Tooltip as TooltipHeatmap} from 'recharts';
import {useUser} from '../../context/UserContext';
import axios from "axios";
import Layout from '../MainLayout';
import Header from '../Header';

Modal.setAppElement("#root");

const Container = styled.div`
    display: flex;
    padding: 20px;
    max-width: 1400px;
    margin: auto;
    gap: 20px;
`;

const Title = styled.h1`
    font-size: 18px;
    font-weight: bold;
    color: #2D3142;
    margin-bottom: 20px;
`;

const LeftSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const RightSection = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const MetricsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
`;

const MetricCard = styled.div`
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    ${({type}) => {
        switch (type) {
            case 'Total':
                return `border: 2px solid #dc3545; color: #dc3545;`;
            case 'Pending':
                return `border: 2px solid #ffc107; color: #ffc107;`;
            case 'InProgress':
                return `border: 2px solid #17a2b8; color: #17a2b8;`;
            case 'Completed':
                return `border: 2px solid #28a745; color: #28a745;`;
            default:
                return `border: 2px solid #6c757d; color: #6c757d;`;
        }
    }}
`;

const ChartContainer = styled.div`
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WorkflowContainer = styled.div`
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ScrollableWorkflowList = styled.div`
    max-height: 260px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    background-color: #f8f9fa;
`;

const WorkflowItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
    margin: 5px;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    background-color: #2D3142;
    color: #fff;
    border: none;
`;

const Input = styled.input`
    padding: 10px;
    width: 100%;
    margin: 10px 0;
`;

const ModalButton = styled.button`
    margin-right: 10px;
    padding: 10px 20px;
    background-color: #2d3142;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const ModalButtonSecondary = styled.button`
    margin-right: 10px;
    padding: 10px 20px;
    background-color: transparent;
    color: #2D3142;
    border: 1px solid #2D3142;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: #2D3142;
        color: white;
    }
`;

export const ManufacturerDashboard = () => {
    const navigate = useNavigate();
    const {user, setUser} = useUser();
    const [workflows, setWorkflows] = useState([]);
    const [efficiencyData, setEfficiencyData] = useState([]);
  const [stepProgress, setStepProgress] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [bottleneckData, setBottleneckData] = useState([]);
    const [showPrompt, setShowPrompt] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (user?.forcePasswordChange) {
            setShowPrompt(true);
        }
    }, [user]);

    useEffect(() => {
        if (!user || !user.user_id) return;

        axios
            .get(`http://localhost:5000/api/workflow?manufacturerId=${user.user_id}`)
            .then((response) => {
                const data = response.data || [];
        setWorkflows(data);
        extractChartData(data);
      })
      .catch((err) => console.error('Failed to load workflows', err));
    }, [user]);

    const handlePasswordChange = async () => {
        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters long.");
        }
        try {
            await axios.post(
                "http://localhost:5000/api/auth/change-password",
                {
                    user_id: user.user_id,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            const updatedUser = {...user, forcePasswordChange: false};
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setNewPassword("");
            setShowPrompt(false);
            setShowForm(false);
            toast.success("Password changed successfully!");
        } catch (err) {
            toast.error("Password update failed.");
            console.error(err);
        }
    };

    const extractChartData = (workflowData) => {
    const efficiencyMap = {}; // { date: { grading: totalMins, count: x } }
    const stepProgressList = [];
    const alertList = [];
    const bottleneckList = [];

    workflowData.forEach((wf) => {
      const version = wf.versions.at(-1);
      const workflowId = wf.workflow_id;
      const bottleneckRow = { workflowId };

      version.steps.forEach((step) => {
        const name = step.pluginName.toLowerCase();
        const start = step.started_at ? new Date(step.started_at) : null;
        const end = step.completed_at ? new Date(step.completed_at) : null;
        const dateKey = start ? new Date(start).toISOString().slice(0, 10) : 'unknown';

        // Efficiency collection
        if (start && end) {
          const durationMin = Math.round((end - start) / 60000);
          if (!efficiencyMap[dateKey]) efficiencyMap[dateKey] = {};
          if (!efficiencyMap[dateKey][name]) efficiencyMap[dateKey][name] = [];
          efficiencyMap[dateKey][name].push(durationMin);
          bottleneckRow[name] = durationMin;
        }

        // Step progress (only first step not completed)
        if (!step.completed_at && !stepProgressList.find(s => s.workflowId === wf.workflow_id)) {
          stepProgressList.push({
            workflowId: wf.workflow_id,
            plugin: step.pluginName,
            started_at: step.started_at,
          });
        }

        // Alerts
        const now = new Date();
        if (!step.started_at && (new Date(wf.created_at) < now - 2 * 86400000)) {
          alertList.push({ workflowId: wf.workflow_id, plugin: step.pluginName, message: 'Step not started after 2+ days' });
        } else if (start && !end && now - start > 60 * 60000) {
          alertList.push({ workflowId: wf.workflow_id, plugin: step.pluginName, message: 'Step running over 60 mins' });
        }
      });
       bottleneckList.push(bottleneckRow);
    });

    const result = Object.entries(efficiencyMap).map(([date, plugins]) => {
      const entry = { date };
      Object.entries(plugins).forEach(([plugin, times]) => {
        entry[plugin] = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      });
      return entry;
    });
    setEfficiencyData(result);
    setStepProgress(stepProgressList);
    setAlerts(alertList);
    setBottleneckData(bottleneckList);
  };

    // const totalWorkflows = workflows.length;
    // const statusCounts = Array.isArray(workflows)
    //     ? workflows.reduce((acc, workflow) => {
    //         acc[workflow.status] = (acc[workflow.status] || 0) + 1;
    //         return acc;
    //     }, {Pending: 0, 'In Progress': 0, Completed: 0})
    //     : {Pending: 0, 'In Progress': 0, Completed: 0};


    // const workflowStatusData = {
    //     labels: ['Pending', 'In Progress', 'Completed'],
    //     datasets: [
    //         {
    //             data: [statusCounts.Pending, statusCounts['In Progress'], statusCounts.Completed],
    //             backgroundColor: ['#ffc107', '#17a2b8', '#28a745'],
    //         },
    //     ],
    // };

    // const updateWorkflowStatus = (index) => {
    //     navigate("/each-workflow")
    // };

    // const productionEfficiencyData = [
    //     {date: "Feb 1", Grading: 20, Cutting: 25, Washing: 18, Drying: 22},
    //     {date: "Feb 2", Grading: 18, Cutting: 22, Washing: 16, Drying: 20},
    //     {date: "Feb 3", Grading: 22, Cutting: 27, Washing: 19, Drying: 23},
    //     {date: "Feb 4", Grading: 17, Cutting: 21, Washing: 15, Drying: 19},
    //     {date: "Feb 5", Grading: 23, Cutting: 28, Washing: 20, Drying: 24}
    // ];

    // const workerProductivityData = [
    //     {worker: "Worker A", day1: 5, day2: 7, day3: 6, day4: 8, day5: 4},
    //     {worker: "Worker B", day1: 4, day2: 5, day3: 7, day4: 6, day5: 9},
    //     {worker: "Worker C", day1: 6, day2: 8, day3: 5, day4: 7, day5: 6},
    //     {worker: "Worker D", day1: 3, day2: 6, day3: 8, day4: 5, day5: 7},
    //     {worker: "Worker E", day1: 7, day2: 5, day3: 6, day4: 8, day5: 4}
    // ];

    const totalWorkflows = workflows.length;

const statusCounts = workflows.reduce((acc, wf) => {
  const lastVersion = wf.versions.at(-1);
  const status = lastVersion?.status?.toLowerCase();

  const mappedStatus = status === 'draft' ? 'In Progress'
                      : status === 'pending' ? 'Pending'
                      : status === 'completed' ? 'Completed'
                      : 'Unknown';

  acc[mappedStatus] = (acc[mappedStatus] || 0) + 1;
  return acc;
}, {});


    return (
        <Layout role="manufacturer">
            <Header title="Dashboard" role="manufacturer"/>
            <ToastContainer/>
            <Modal isOpen={showPrompt} onRequestClose={() => setShowPrompt(false)} style={{
                content: {
                    width: '500px',
                    height: '250px',
                    margin: 'auto',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            }}>
                {!showForm ? (
                    <>
                        <h3 style={{marginBottom: '20px', fontSize: '18px', color: '#333'}}>
                            Would you like to change your password?
                        </h3>
                        <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                            <ModalButtonSecondary onClick={() => setShowPrompt(false)}>Skip for Now</ModalButtonSecondary>
                            <ModalButton onClick={() => setShowForm(true)}>Update Password</ModalButton>

                        </div>
                    </>
                ) : (
                    <>
                        <h3 style={{marginBottom: '20px'}}>Change Your Password</h3>
                        <Input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px'}}>
                            <ModalButtonSecondary onClick={() => setShowPrompt(false)}>Cancel</ModalButtonSecondary>
                            <ModalButton onClick={handlePasswordChange}>Submit</ModalButton>

                        </div>
                    </>
                )}
            </Modal>
            <Container>
                <LeftSection>
                    <MetricsContainer>
                        <MetricCard type="Total">Total: {totalWorkflows}</MetricCard>
                        <MetricCard type="Pending">Pending: {statusCounts.Pending || 0}</MetricCard>
                        <MetricCard type="InProgress">In Progress: {statusCounts['In Progress'] || 0}</MetricCard>
                        <MetricCard type="Completed">Completed: {statusCounts.Completed || 0}</MetricCard>
                    </MetricsContainer>
                    <ChartContainer>
                        <Title>Step Bottleneck Heatmap</Title>
                        <div style={{ overflowX: 'auto' }}>
              <table width="100%" border="1" style={{ borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                  <tr>
                    <th>Workflow</th>
                    <th>Grading</th>
                    <th>Cutting</th>
                    <th>Washing</th>
                    <th>Drying</th>
                  </tr>
                </thead>
                <tbody>
                  {bottleneckData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.workflowId}</td>
                      {["grading", "cutting", "washing", "drying"].map((plugin) => (
                        <td
                          key={plugin}
                          style={{ backgroundColor: row[plugin] ? `rgba(216, 149, 39, ${Math.min(row[plugin] / 60, 1)})` : '#eee' }}
                        >
                          {row[plugin] ? `${row[plugin]}m` : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                    </ChartContainer>
                    <WorkflowContainer>
                        <Title>Alerts</Title>
                        <ScrollableWorkflowList>
              {alerts.length === 0 ? (
                <p>No alerts at this time.</p>
              ) : (
                alerts.map((alert, idx) => (
                  <WorkflowItem key={idx}>
                    <span>{alert.workflowId} — {alert.plugin}</span>
                    <span>{alert.message}</span>
                  </WorkflowItem>
                ))
              )}
            </ScrollableWorkflowList>
                    </WorkflowContainer>
                </LeftSection>

                <RightSection>
                    <ChartContainer>
                        <Title>Production Efficiency Over Time (in minutes)</Title>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={efficiencyData}
                                       margin={{top: 10, right: 30, left: 0, bottom: 10}}>
                                <CartesianGrid strokeDasharray="3 5"/>
                                <XAxis dataKey="date"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="grading" stroke="#8884d8"/>
                                <Line type="monotone" dataKey="cutting" stroke="#82ca9d"/>
                                <Line type="monotone" dataKey="washing" stroke="#ffc658"/>
                                <Line type="monotone" dataKey="drying" stroke="#ff7300"/>
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    <WorkflowContainer>
                        <Title>Current Step Progress</Title>
                        <ScrollableWorkflowList>
              {stepProgress.map((step, idx) => (
                <WorkflowItem key={idx}>
                  <span>{step.workflowId} — {step.plugin}</span>
                  <span>{step.started_at ? `Started at ${new Date(step.started_at).toLocaleTimeString()}` : 'Not started'}</span>
                </WorkflowItem>
              ))}
            </ScrollableWorkflowList>
                    </WorkflowContainer>
                </RightSection>
            </Container>
        </Layout>
    );
};
