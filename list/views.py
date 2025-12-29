from django.core.paginator import Paginator
from datetime import datetime
from django.utils import timezone
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.contrib import messages
from django.db.models import Q

from list.models import Todo

def todo_view(request):
    if request.method == "POST":
        todo_id = request.POST.get('todo_id')
        title = (request.POST.get("title") or "").strip()
        image = request.FILES.get("image")
        end_time_str = request.POST.get("end_time")

        # safety
        if not title or not end_time_str:
            messages.error(request, "Title and End time are required.")
            return redirect("/todo/")

        end_time = timezone.make_aware(datetime.fromisoformat(end_time_str))

        if todo_id:
            todo = Todo.objects.get(id=todo_id)
            todo.title = title
            todo.end_time = end_time
            if image:
                todo.image = image
            todo.save()
            messages.success(request, "Todo Updated successfully")
        else:
            Todo.objects.create(
                title=title,
                end_time=end_time,
                image=image
            )
            messages.success(request, "Todo added successfully")

        return redirect("/todo/")  # ✅ important

    # ---------------- GET (search + pagination) ----------------
    query = (request.GET.get("q") or "").strip()

    qs = Todo.objects.all().order_by("-created_at")
    if query:
        qs = qs.filter(Q(title__icontains=query))

    paginator = Paginator(qs, 3)
    page_obj = paginator.get_page(request.GET.get("page", 1))

    context = {
        "all_todo": page_obj,
        "query": query,
    }
    return render(request, "todo.html", context)


def done_view(request, task_id):
    try:
        todo = Todo.objects.get(id=task_id)
        todo.done = True
        todo.save()
        messages.success(request, "Task Done !!!")
        return redirect("/todo/")
    except Todo.DoesNotExist:
        return HttpResponse("Undefined Task")


def delete_view(request, task_id):
    try:
        todo = Todo.objects.get(pk=task_id)
    except Todo.DoesNotExist:
        messages.error(request, "Task not Found!!!!")
        return redirect("/todo/")

    todo.delete()
    return redirect("/todo/")
