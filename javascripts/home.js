with (scope('Home', 'App')) {

  route('#', function() {
    // render nothing, then hide the content for now... we're using before-content!!
    render('');
    hide('content');

    var default_avatar_url = 'https://a248.e.akamai.net/assets.github.com/images/gravatars/gravatar-user-420.png';

    var stats_container, leaderboard_container;
    
    render({ into: 'before-content' },
      section({ id: 'homepage' },
        div({ 'class': 'box', style: 'float: left; margin-right: 10px' },
          div({ 'class': 'inner bigbox', style: 'width: 694px; height: 250px' },
            h1(span({ style: 'font-weight: bold' }, 'Bounty'), 'Source is a funding platform for open-source bugs and features.'),
            div({ 'class': 'h1-line'}, div()),

            div({ 'class': 'devbox' },
              h2('Developers:'),
              p('Earn money by contributing to open-source.')
            ),

            div({ 'class': 'backerbox' },
              h2('Backers:'),
              p('Support the projects that have supported you.')
            ),

            div({ style: 'clear: both '}),

            div({ 'class': 'begin-box' },
              div({ style: 'margin-left: 70px; margin-right: 40px; float: left; text-align: center; '},
                a({ 'class': 'blue', style: 'width: 200px; display: block', href: '#bounties' }, 'Browse All Projects')
              ),
              div({ style: 'font-size: 30px; line-height: 40px; float: left; padding: 0 5px'}, 'or'),

              div({ style: 'width: 330px; float: left; text-align: center'},
                form({ action: function(form_data) { set_route('#repos/search?query='+escape(form_data.query)) } },
                  text({ name: 'query', placeholder: 'Project Name' }),
                  submit({ value: 'Search', 'class': 'green', style: 'width: 80px' })
                )
              )
            )
          )
        ),

        div({ 'class': 'box', style: 'float: left' },
          stats_container=div({ 'class': 'inner stats', style: 'width: 150px; height: 250px' })
        ),
        
        div({ style: 'clear: both; padding-bottom: 10px' }),

        div({ 'class': 'box' },
          leaderboard_container=div({ 'class': 'inner leaderboard' })
        )
      )
    );

    BountySource.overview(function(response) {
      var data = (response.data||{});
      render({ into: stats_container }, 
        h2(number(data.total_active_issues)),
        h3({ 'class': 'blue-line' }, 'Open Contest' + (data.total_active_issues == 1 ? '' : 's')),

        h2(money(data.total_unclaimed)),
        h3({ 'class': 'orange-line' }, 'Active Bounties'),

        h2(money(data.total_paid_last_month)),
        h3({ 'class': 'green-line' }, 'Payout Last Month')
      );

      render({ into: leaderboard_container }, 
        section({ style: 'width: 390px'},
          div({ style: 'text-align: center' }, img({ src: 'images/icon-info.png' })),
          h2('Staff Picks'),
          ul(
            data.projects.featured.map(function(repo) {
              console.log(repo.avatar_url);
              return li(img({ src: (repo.avatar_url || default_avatar_url),
                              style: 'width: 32px; height: 32px' }),
                a({ href: '#repos/' + repo.full_name, style: 'color: #222' }, repo.display_name))
            })
          )
        ),
        section({ style: 'width: 200px'},
          div({ style: 'text-align: center' }, img({ src: 'images/icon-check.png' })),
          h2('Top Backers'),
          ul(
            data.backers.most_total_bounties.map(function(backer) {
              return li(img({ src: backer.avatar_url || default_avatar_url,
                style: 'width: 32px; height: 32px' }), backer.display_name)
            })
          )
        ),
        section({ style: 'width: 200px; margin-right: 0'},
          div({ style: 'text-align: center' }, img({ src: 'images/icon-info.png' })),
          h2('Top Developers'),
          ul(
            // most_submitted_solutions is dummy data. most_pull_requests isn't but doesn't have data
            data.developers.most_submitted_solutions.map(function(developer) {
              return li(img({ src: developer.avatar_url || default_avatar_url,
                style: 'width: 32px; height: 32px' }), developer.github_login)
            })
          )
        ),
        div({ style: 'clear: both' })
      );
    })
  });
  
}
