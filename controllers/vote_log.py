#
# Copyright 2011, Alexandre Strzelewicz
# Licensed under the MIT Version
#


#
#
# Vote log
#
#

def index():
    votes_log = db(db.vote_log.id>0).select(db.vote_log.ALL,
                                            orderby=~db.vote_log.date_created,
                                            limitby=(0,10))
    return dict(votes=votes_log)

def up():
    # Test if user already voted
    vote = db((auth.user.id==db.entr_vote_user.auth_user) &
               (request.vars.id==db.entr_vote_user.vote_log)).select()
    if (len(vote) == 1):
        return response.json({'success':'false'})

    # Insert new relation
    db.entr_vote_user.insert(auth_user=auth.user.id,vote_log=request.vars.id)
    db(db.vote_log.id==request.vars.id).update(votes=db.vote_log.votes+1)
    return response.json({'success':'true'})

def down():
    # Test if user already voted
    vote = db((auth.user.id==db.entr_vote_user.auth_user) &
               (request.vars.id==db.entr_vote_user.vote_log)).select()
    if (len(vote) == 1):
        return response.json({'success':'false'})

    # Insert new relation
    db.entr_vote_user.insert(auth_user=auth.user.id, vote_log=request.vars.id)
    db(db.vote_log.id==request.vars.id).update(votes=db.vote_log.votes-1)
    return response.json({'success':'true'})

