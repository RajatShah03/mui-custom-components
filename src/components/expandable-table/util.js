import { useEffect, useState } from 'react';
import { useAuth } from '../../api/auth';
import ProjectCreationServices from '../../api/service/project-creation';
import useAlert from '../../hooks/useAlert';
// import mock from './mock.json';

const createProjectData = (projects) => {
  return projects.map(project => {
    return {
      projectName: project.gitLabProjectInfo.projectName,
      language: project.templateTech,
      created_on: project.projectCreationEndTime,
      infrastructure: `${project.pipelineDeployments.length} Environment(s)`,
      expanded: project.pipelineDeployments.length === 0 ? (
        {
          error: true,
        }
      ) : (
        project.pipelineDeployments.map(({
          env,
          version,
          deploymentTime,
          adminConsoleUrl,
          appEndpoint,
          metricsEndpoint,
          logEndpoint,
        }) => ({
          env,
          version,
          deploymentTime,
          infra: {
            adminConsoleUrl,
            appEndpoint,
            metricsEndpoint,
            logEndpoint,
          },
        }))
      ),
      extra: {...project},
    };
  });
};

const useProjects = () => {
  const { errorAlert } = useAlert();

  const { user } = useAuth();

  const [projects, setProjects] = useState('loading');

  useEffect(() => {
    if (user) {
      ProjectCreationServices.getProjectCreationEmail(`/user/${user.email}`)
        .then(response => {
          const projectsTableData = createProjectData(response.data.projects);
          setProjects(projectsTableData);
        })
        .catch(error => {
          setProjects([]);
          errorAlert(error);
        });
      // const projectsTableData = createProjectData(mock);
      // setProjects(projectsTableData);
    }
  }, [user]);

  return projects;
};

export default useProjects;
