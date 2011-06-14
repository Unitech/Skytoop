

import xss

def decorate(decorator):
    def new_decorator(f):
        g = decorator(f)
        g.__name__ = f.__name__
        g.__doc__ = f.__doc__
        g.__dict__.update(f.__dict__)
        return g
    new_decorator.__name__ = decorator.__name__
    new_decorator.__doc__ = decorator.__doc__
    new_decorator.__dict__.update(decorator.__dict__)
    return new_decorator

#
# Sample Use:
#

@decorate
def xssremove(func):
    def you_will_never_see_this_name(*args, **kwargs):
        print environment.request
        return func(*args, **kwargs)
    return you_will_never_see_this_name

# def xssremove(self, role=None, group_id=None):
#     def decorator():
#         def f(*a, **b):
#             logger.debug('test')
#     return decorator
