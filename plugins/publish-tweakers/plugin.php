<?php

/**
 * Datawrapper Publish Tweakers
 *
 */

class DatawrapperPlugin_PublishTweakers extends DatawrapperPlugin {

    public function init() {
        DatawrapperHooks::register(DatawrapperHooks::PUBLISH_FILES, array($this, 'publish'));
        DatawrapperHooks::register(DatawrapperHooks::UNPUBLISH_FILES, array($this, 'unpublish'));
        DatawrapperHooks::register(DatawrapperHooks::GET_PUBLISHED_URL, array($this, 'getUrl'));
    }

    /**
     * pushs a list of files to S3
     *
     * @param files list of file descriptions in the format [localFile, remoteFile, contentType]
     * e.g.
     *
     * array(
     *     array('path/to/local/file', 'remote/file', 'text/plain')
     * )
     */
    public function publish($files) {
        $dir = $GLOBALS['dw_config']['publication_path'];

        foreach ($files as $file) {
            if ($this->checkPath($dir . $file[1])) {
                copy($file[0], $dir . $file[1]);
            }
        }
    }

    /**
     * Removes a list of files from S3
     *
     * @param files  list of remote file names (removeFile)
     */
    public function unpublish($files) {
        // NYI
    }


    /**
     * Returns URL to the chart hosted on chart domain
     *
     * @param chart Chart class
     */
    public function getUrl($chart) {
        return '//' . $GLOBALS['dw_config']['chart_domain'] . '/' . $chart->getID() . '/' . $chart->getPublicVersion() . '/index.html';
    }
    
    /**
     * Checks if a filepath exists, if not create it
     *
     * @param file Filepath to check
     */
    private function checkPath($file) {
        if (!file_exists(dirname($file))) {
            return mkdir(dirname($file), 0777, true);
        }
        return true;
    }
}
