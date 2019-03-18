import React, { Component } from 'react';
import { Media } from 'reactstrap';
import '../css/aboutus/aboutus.css';
// import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import { MEMBERS } from '../shared/members';

const inlineStyles = {
    marginBottom: 30,
    padding: 80,
    width: "100%"
};

const RenderMember = ({you}) => {
    return (
        <Media tag="li">
            <Media object src={you.image} alt={you.name} className="align-self-center circle-img" height="90" width="90"/>
            <Media body className="ml-5">
                <Media heading>
                    {you.name} ({you.abbr})
                </Media>
                <p className="school">{you.class} - {you.university}. His skills are {you.skills}</p>
                <p className="mb-0 role">{you.role}</p>
            </Media>
        </Media>
    );
}

class About extends Component {
    constructor(props) {
        super(props);

        this.state = {
            members: MEMBERS
        }
    }

    render() {
        const members = this.state.members.map((member) => {
            return (
                <div key={member.id} className="col-12 member-cont">
                    <RenderMember you={member} />
                </div>
            );
        })
        return (
            <div className="container about-us-container">
                <div className="row col-12">
                    <Paper zDepth={1} style={inlineStyles} className="mission-paper">
                        <div>
                            <div className="text-center">
                                <h2>- Our Mission -</h2>    
                            </div>
                            <div className="text-center trust">
                                <p>Make users trust, discouraging hackers.</p>
                            </div>
                            <div className="text-center about">
                                <h2>- About -</h2>
                            </div>
                            <div className="text-justify in-about">
                                <p>
                                    Lorem ipsum dolor sit amet, nam no dictas scriptorem. Amet graeco cum cu, stet conceptam constituam est te, ius ludus nostro id. Id omnes equidem detraxit his, feugiat hendrerit inciderint vim ad, no cum ignota posidonium. Qui te erat abhorreant scripserit, ad mollis invidunt cum. Ea illum error partem vim. Ad eam falli facete tritani.
                                    <br />
                                    Id sit assum indoctum corrumpit. Vix atqui aperiri an, cum solum torquatos pertinacia ne, nam agam platonem postulant an. Ipsum percipitur mei ut. Dicam delectus mei ea, mutat solum qui eu.
                                </p>
                            </div>
                        </div>
                    </Paper>
                </div>
                <div className="row col-12">
                    <Paper zDepth={1} style={inlineStyles}>
                        <div>
                            <div className="text-center membership">
                                <h2>- Membership -</h2>
                            </div>
                            <div>
                                <Media list>
                                    {members}
                                </Media>
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default About;    