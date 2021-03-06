import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Label } from 'light-ui';
import dateHelper from 'UTILS/date';
import { validateUrl } from 'UTILS/helper';
import validator from 'UTILS/validator';
import { objectassign } from 'SHARED/utils/resume';
import GithubComponent from 'SHARED/components/GithubComponent';
import styles from './resume_v1.css';
import statusLabels from '../shared/StatusLabels';

const { hoursBefore } = dateHelper.relative;

const info = (options) => {
  const { text, icon, type, style = '' } = options;
  const component = options.component || null;

  return (
    <div className={cx(styles[`${type}_info`], style)}>
      <i
        className={cx(`fa fa-${icon}`, styles[`${type}_icon`])} aria-hidden="true"
      />
      &nbsp;&nbsp;
      {component || text}
    </div>
  );
};

const linkInfo = (options) => {
  const { url, title, style = '' } = options;
  const hasUrl = validator.url(url);
  const headerClass = cx(
    styles.info_header,
    hasUrl && styles.link,
    style
  );

  return hasUrl ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={validateUrl(url)}
      className={headerClass}
    >
      <i className="fa fa-link" aria-hidden="true" />&nbsp;
      {title}
    </a>
  ) : (<div className={headerClass}>{title}</div>);
};

const baseInfo = (text, icon, options = {}) => info(objectassign({}, {
  text,
  icon,
  type: 'base',
  ...options
}))

const titleInfo = (text, icon, options = {}) => info(objectassign({}, {
  text,
  icon,
  type: 'title',
  ...options
}));

class ResumeComponentV1 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showGithub: false
    };
    this.changeShowGithub = this.changeShowGithub.bind(this);
  }

  changeShowGithub(showGithub) {
    this.setState({ showGithub });
  }

  renderEducations() {
    const { educations } = this.props.resume;

    const edus = educations
      .map((edu, index) => {
        const { school, major, education, startTime, endTime } = edu;
        return (
          <div key={index} className={styles.section_wrapper}>
            <div className={cx(styles.info_header, styles.info_header_large)}>
              {school}{education ? `, ${education}` : ''}
            </div>
            <div className={styles.info_text}>
              {startTime}  ~  {endTime}
            </div>
            <div className={styles.info_text}>{major}</div>
          </div>
        );
      });

    if (!edus.length) { return; }

    return (
      <div className={styles.section}>
        {titleInfo('教育经历', 'university')}
        <div className={styles.info_timeline}>
          {edus}
        </div>
      </div>
    );
  }

  renderWorkExperiences() {
    const { workExperiences } = this.props.resume;

    const exps = workExperiences
      .map((experience, index) => {
        const {
          url,
          company,
          startTime,
          endTime,
          position,
          projects,
        } = experience;
        const workProjects = this.renderProjects(projects);
        return (
          <div key={index} className={styles.section_wrapper}>
            {linkInfo({ url, title: company, style: styles.info_header_large })}
            {position ? `, ${position}` : ''}
            <div className={styles.info_text}>
              {startTime}  ~  {endTime}
            </div>
            <div>{workProjects}</div>
            <div className={styles.section_dot} />
          </div>
        );
      });

    if (!exps.length) { return; }

    return (
      <div className={styles.section}>
        {titleInfo('工作经历', 'file-text-o')}
        <div className={styles.info_timeline}>
          {exps}
        </div>
      </div>
    );
  }

  renderProjects(projects) {
    return projects.map((project, index) => {
      const { name, url, details } = project;
      const projectDetails = details.map((detail, i) => (
        <li key={i}>
          {detail}
        </li>
      ));
      return (
        <div key={index} className={styles.project_section}>
          {linkInfo({ url, title: name, style: styles.info_header_mid })}
          <ul className={styles.info_intro}>
            {projectDetails}
          </ul>
        </div>
      );
    });
  }

  renderPersonalProjects() {
    const { personalProjects } = this.props.resume;

    const projects = personalProjects
      .map((project, index) => {
        const { url, desc, techs, title } = project;
        const projectTechs = techs.map((tech, i) => (
          <Label
            min
            key={i}
            text={tech}
            clickable={false}
            color="darkLight"
            className={styles.info_label}
          />
        ));
        return (
          <div key={index} className={styles.sec_section}>
            {linkInfo({ url, title, style: styles.info_header_large })}
            <div className={styles.info_text}>
              {desc}
            </div>
            <div className={styles.project_labels}>
              {projectTechs}
            </div>
          </div>
        );
      });

    if (!projects.length) { return; }

    return (
      <div className={styles.section}>
        {titleInfo('个人项目', 'code')}
        <div className={styles.info_wrapper}>
          {projects}
        </div>
      </div>
    );
  }

  renderSupplements() {
    const { others } = this.props.resume;
    const { supplements } = others;
    if (!supplements.length) { return; }

    const personalSupplements = supplements.map((supplement, index) => (
      <li key={index}>
        {supplement}
      </li>
    ));

    return (
      <div className={styles.section}>
        {titleInfo('自我评价', 'quote-left')}
        <div className={styles.info_wrapper}>
          <ul className={styles.info_intro}>
            {personalSupplements}
          </ul>
        </div>
      </div>
    );
  }

  renderSocialLinks() {
    const { others } = this.props.resume;
    const { socialLinks } = others;
    if (!socialLinks.length) { return null; }

    const socials = socialLinks.map((social, index) => {
      const { url, text } = social;
      return (
        <li key={index}>
          <div className={styles.link_wrapper}>
            {text}
            &nbsp;:&nbsp;&nbsp;&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={styles.list_link}
              href={social.validateUrl}
            >
              {url}
            </a>
          </div>
        </li>
      );
    });

    return (
      <div className={styles.section}>
        {titleInfo('其他链接', 'link')}
        <div className={styles.info_wrapper}>
          <ul className={styles.info_intro}>
            {socials}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const { showGithub } = this.state;
    const { resume, shareInfo, login, updateText } = this.props;
    const { others, updateAt, educations, workExperiences } = resume;
    const resumeInfo = resume.info || {};
    const { useGithub, github, githubUrl } = shareInfo;
    const its = resumeInfo.gender === 'male' ? '他' : '她';
    const viewGitHub = `查看${its}的 GitHub 总结报告`;

    if (useGithub && showGithub) {
      return (
        <div className={styles.container}>
          <div
            className={cx(
              styles.github_wrapper,
              showGithub && styles.github_wrapper_active
            )}
          >
            {baseInfo(null, 'arrow-left', {
              style: styles.base_info_header,
              component: (
                <span
                  onClick={() => this.changeShowGithub(false)}
                >
                  返回
                </span>
              )
            })}
            <GithubComponent
              isShare
              githubSection={github}
              containerStyle={styles.github_container}
              login={login}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div
          className={cx(
            styles.wrapper
          )}
        >
          <div className={styles.left}>
            {this.renderEducations()}
            {this.renderWorkExperiences()}
            {this.renderPersonalProjects()}
            {this.renderSupplements()}
            {this.renderSocialLinks()}
          </div>
          <div className={styles.right}>
            {baseInfo(resumeInfo.name, resumeInfo.gender, { style: styles.user_title })}
            {statusLabels({
              educations,
              resumeInfo,
              workExperiences
            })}
            <br />
            {resumeInfo.phone
              ? (baseInfo(resumeInfo.phone, 'mobile', { style: styles.right_info }))
              : ''
            }
            {resumeInfo.email
              ? (baseInfo(null, 'envelope-o', {
                component: (
                  <a
                    href={`mailto:${resumeInfo.email}`}
                    className={styles.right_link}
                  >
                    {resumeInfo.email}
                  </a>
                )
              }))
              : ''
            }
            {resumeInfo.location
              ? baseInfo(`${resumeInfo.location}   ${resumeInfo.intention}`, 'map-marker', { style: styles.right_info })
              : ''
            }
            {others.dream ? (
              <div className={styles.user_dream}>
                {baseInfo(others.dream, 'quote-left', { style: styles.right_info })}
              </div>
            ) : ''}
            {useGithub ? (
              baseInfo(null, 'github', {
                component: githubUrl ? (
                  <a
                    href={githubUrl}
                    className={styles.right_link_info}
                  >
                    {viewGitHub}
                  </a>
                ) : (
                  <a
                    onClick={() => this.changeShowGithub(true)}
                    className={styles.right_link_info}
                  >
                    {viewGitHub}
                  </a>
                )
              })
            ) : ''}
            <br />
            {updateAt ? (
              baseInfo(
                `${updateText}${hoursBefore(updateAt)}`,
                'exclamation-circle',
                { style: styles.right_info_tip }
              )
            ) : ''}
          </div>
        </div>
      </div>
    );
  }
}

ResumeComponentV1.propTypes = {
  resume: PropTypes.object,
  shareInfo: PropTypes.object,
  login: PropTypes.string
};

ResumeComponentV1.defaultProps = {
  resume: {},
  shareInfo: {},
  login: ''
};

export default ResumeComponentV1;
