import React from 'react';
import { Link, navigate } from 'gatsby';
import styled from 'styled-components';
import { useSecuredRoute } from '../../api/auth';
import ExpandableTable from './common/ExpandableTable';
import EmptyState from './EmptyState';
import MyProjectsHeader from './MyProjectsHeader';
import useProjects from './util';
import SpinnerLoader from '../../../src/components/common/SpinnerLoader';
import metrics from '../../../src/images/Infra-device@3x-icon.png';
import infraGreen from '../../../src/images/infra-green.png';
import infraVector2 from '../../../src/images/Infra-Vector2@3x-icon.png';
import infraVector from '../../../src/images/Infra-Vector@3x-icon.png';
import { Tooltip } from '@material-ui/core';

const PageContainer = styled.div`
  background-color: #ebf0f8;
`;

const ContentContainer = styled.div`
  padding: 4rem;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: ${({ col }) => col ? 'column' : 'row'};
  justify-content: ${({ justify }) => justify || 'center'};
  align-items: ${({ align }) => align || 'flex-start'};
`;

const MyProjectsTableWrapper = styled.div`
  width: 80%;
  margin: 0rem auto 4rem auto;
`;

const ProjectsCounter = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  font-family: Helvetica;
  font-size: 16px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #4b4d61;
`;

const LanguageContainer = styled.span`
  padding: 4px 1rem;
  border: 1px solid #e20074;
  border-radius: 1rem;
  text-align: center;
  color: #e20074;
  font-weight: 600;
`;

const InfraContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  & > a > img {
    width: 20px;
    height: 20px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #4b4d61;
  font-weight: 500;
  &:hover {
    color: #e20074 !important;
  }
`;

const DeploymentPipeLineCommits = styled.a`
  font-family: Helvetica;
  font-weight: normal;
  font-size: 12px;
  line-height: 11px;
  color: #E20074;
  &:hover {
    color: #E20074;
  }
`;

const DeploymentActiveText = styled.a`
  color: #f10f85 !important;
  text-decoration: underline;
`;

const Ellipsify = styled.div`
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: capitalize;
`;

const ProjectLink = ({children, props}) => {
  return (
    <StyledLink to={`/project-details?projectId=${props}&mp=true`}>
      <Ellipsify title={children}>{children}</Ellipsify>
    </StyledLink>
  );
};

const tableHeader = {
  projectName: 'PROJECT NAME',
  language: 'LANGUAGE',
  created_on: 'CREATED ON',
  infrastructure: 'INFRASTRUCTURE',
};

const expandedHeader = {
  env: 'Deployments',
  version: 'Version',
  deploymentTime: 'Deployment Time',
  infra: 'Links',
};

const tableLayout = {
  projectName: {
    colSpan: 5,
    align: 'left',
  },
  language: {
    colSpan: 3,
    align: 'left',
  },
  created_on: {
    colSpan: 5,
    align: 'left',
  },
  infrastructure: {
    colSpan: 5,
    align: 'center',
  },
  expanded: {
    env: {
      colSpan: 3,
      align: 'left',
    },
    version: {
      colSpan: 2,
      align: 'left',
    },
    deploymentTime: {
      colSpan: 3,
      align: 'left',
    },
    infra: {
      colSpan: 4,
      align: 'center',
    },
  }
};

const handleDuplication = (project) => {
  navigate(
    `/projectConfiguration?id=${project.apiRequestInfo.requestPayload.templateId}`,
    {
      state: { templateFields: project.apiRequestInfo.requestPayload.templateFields },
    }
  );
};

const moreOptions = [
  {
    label: 'Duplicate',
    action: handleDuplication,
  },
];

const DeploymentEnv = ({ root, current, currentIndex }) => {
  const commitLinks = root.gitLabProjectInfo && root.gitLabProjectInfo.webUrl;
  const pipelineDeployments = root.pipelineDeployments[currentIndex];
  return (
    <div>
      <Ellipsify title={current}>
        {current}
      </Ellipsify>
      <DeploymentPipeLineCommits
        href={commitLinks +'/-/commit/'+ pipelineDeployments.gitCommitHash}
        target="_blank"
      >
        [{pipelineDeployments.gitCommitTitle}]
      </DeploymentPipeLineCommits>
    </div>
  );
};

const InfraComponent = (props) => {
  const renderWithTooltip = (title, link, img, alt) => {
    return (
      <Tooltip title={title} arrow>
        <a href={link}><img src={img} alt={alt} /></a>
      </Tooltip>
    );
  };

  const renderInfra = (key) => {
    switch(key) {
    case 'adminConsoleUrl':
      return (
        renderWithTooltip(
          'Admin Console',
          props.current[key],
          infraVector,
          'adminConsoleUrl'
        )
      );
    case 'appEndpoint':
      return (
        renderWithTooltip('Endpoint', props.current[key], infraVector2, 'appEndpoint')
      );
    case 'metricsEndpoint':
      return (
        renderWithTooltip('Metrics', props.current[key], metrics, 'metricsEndpoint')
      );
    case 'logEndpoint':
      return (
        renderWithTooltip('Logs', props.current[key], infraGreen, 'logEndpoint')
      );
    }
  };
  return (
    <InfraContainer>{Object.keys(props.current).map(renderInfra)}</InfraContainer>
  );
};

const NoDeploymentsError = ({ root }) => {
  const commitLinks = root.gitLabProjectInfo && root.gitLabProjectInfo.webUrl;
  return (
    <div>
      No deployments found.{' '}
      &nbsp;
      <DeploymentActiveText href={commitLinks + '/-/pipelines'} target="_blank">
        Click here
      </DeploymentActiveText>
      &nbsp;
      to view your projects pipeline to see any attempted deployments.</div>
  );
};

const MyProjects = () => {
  useSecuredRoute();

  const projects = useProjects();

  return (
    <PageContainer>
      <MyProjectsHeader />
      <ContentContainer>
        {projects === 'loading' ? <SpinnerLoader /> : projects.length === 0 ? (
          <EmptyState />
        ) : (
          <MyProjectsTableWrapper>
            <ProjectsCounter>
              {`Showing all Projects (${projects.length})`}
            </ProjectsCounter>
            <ExpandableTable
              head={tableHeader}
              expandedHead={expandedHeader}
              data={projects}
              expandable="infrastructure"
              sortBy="created_on"
              customCellComponent={{
                projectName: ProjectLink,
                language: LanguageContainer,
                expanded: {
                  env: DeploymentEnv,
                  infra: InfraComponent,
                },
              }}
              errorComponent={{
                expanded: NoDeploymentsError
              }}
              customLayout={tableLayout}
              moreOptions={moreOptions}
            />
          </MyProjectsTableWrapper>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default MyProjects;
