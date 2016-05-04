module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/bag',
      deployTo: '/root/bag',
      repositoryUrl: 'git@github.com:luizguilhermesj/front-end-recruitment.git',
      ignores: ['.git'],
      rsync: ['--del'],
      keepReleases: 4
    },
    production: {
      servers: 'root@162.243.215.133'
    }
  });

  shipit.task('npm',['deploy'], function () {
    return shipit.remote('cd '+shipit.releasePath+' && npm install');
  });

  shipit.task('restart',['npm'], function(){
    shipit.remote('forever stop '+shipit.currentPath+'/bin/www');
    shipit.remote('PORT=8888 forever start '+shipit.currentPath+'/bin/www');

  });

  shipit.start('deploy','npm','restart');
};