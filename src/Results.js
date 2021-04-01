import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ABStats from './ABStats';
import reactMuiMarkdownRenderers from "./reactMuiMarkdownRenderers";
import ReactMarkdown from "react-markdown";
import Typography from "@material-ui/core/Typography";
import TagStats from "./TagStats";
import {abStats, tagStats} from "./stats";
import {encodeTestResults} from "./share";
import {Button, ClickAwayListener, IconButton, Link, TextField, Tooltip} from "@material-ui/core";
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shared: false,
            isCopiedTooltipOpen: false,
        };
        this.handleShareClick = this.handleShareClick.bind(this);
        this.handleCopyClick = this.handleCopyClick.bind(this);
        this.createShareUrl = this.createShareUrl.bind(this);
    }

    handleShareClick() {
        this.setState({shared: true});
    }

    handleCopyClick(shareUrl) {
        // Write share URL to clipboard
        navigator.clipboard.writeText(shareUrl);
        // Open tooltip
        this.setState({isCopiedTooltipOpen: true});
        // Close tooltip after 1 second
        setTimeout(() => {this.setState({isCopiedTooltipOpen: false})}, 1000);
    }

    createShareUrl() {
        const results = this.props.results.map(result => abStats(result.name, result.optionNames, result.userSelections));
        const encodedResults = encodeTestResults(results, this.props.config);
        const url = new URL(window.location.toString());
        const configUrl = url.searchParams.get('test');
        url.searchParams.delete('test');
        url.searchParams.set('results', encodedResults);
        url.searchParams.set('results', encodedResults);
        url.searchParams.set('test', configUrl);
        return url.toString();
    }

    render() {
        const allStats = [];
        for (let i = 0; i < this.props.results.length; ++i) {  // Looping tests
            let stats;
            if (this.props.results[i].testType.toLowerCase() === 'ab') {
                stats = (
                    <ABStats
                        name={this.props.results[i].name}
                        optionNames={this.props.results[i].optionNames}
                        userSelections={this.props.results[i].userSelections}
                    />
                )
            }
            allStats.push(
                <Box key={i} mb="12px">
                    {stats}
                </Box>
            )
        }
        const tagSts = tagStats(this.props.results, this.props.config);
        const shareUrl = this.createShareUrl();
        return (
            <Box mt="16px" className="width100p">
                <Paper>
                    <Box display="flex" flexDirection="column" p="16px">
                        {this.props.description &&
                        <Box key={-1} mb="16px">
                            <ReactMarkdown renderers={reactMuiMarkdownRenderers} children={this.props.description}/>
                        </Box>}
                        {allStats}
                        {tagSts &&
                        <Box>
                            <Box mb="16px">
                                <Typography variant="h4">Aggregated results</Typography>
                            </Box>
                            <Box>
                                <TagStats config={this.props.config} results={this.props.results} />
                            </Box>
                        </Box>}
                        <Box className="centerText" display={this.state.shared ? 'none': 'block'}>
                            <Button color="secondary" startIcon={<ShareIcon />} onClick={this.handleShareClick}>
                                Share your results
                            </Button>
                        </Box>
                        <Box className="centerText" display={this.state.shared ? 'block': 'none'}>
                            <Box display="flex" flexDirection="row">
                                <Typography color="primary">{shareUrl}</Typography>
                                <Tooltip
                                    open={this.state.isCopiedTooltipOpen}
                                    disableFocusListener
                                    disableHoverListener
                                    disableTouchListener
                                    placement="top"
                                    title="Copied!"
                                >
                                    <IconButton
                                        color="primary"
                                        onClick={() => { this.handleCopyClick(shareUrl); }}
                                    >
                                        <FileCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        )
    }
}

export default Results;
